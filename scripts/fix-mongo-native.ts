import fs from 'fs';
import path from 'path';
import dns from 'dns/promises';

async function fixMongoURI() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('No .env.local found');
    return;
  }

  let envContent = fs.readFileSync(envPath, 'utf8');
  const uriMatch = envContent.match(/MONGODB_URI=["']?(mongodb\+srv:\/\/[^"'\n]+)["']?/);
  
  if (!uriMatch) {
    console.log('No mongodb+srv string found in .env.local or it is already converted.');
    return;
  }

  const oldUri = uriMatch[1];
  console.log('Found mongodb+srv string. Using custom DNS resolver to bypass local block...');

  const regex = /mongodb\+srv:\/\/([^:]+:[^@]+)@([^/]+)\/(.*?)$/;
  const parts = oldUri.match(regex);

  if (!parts) {
    console.error('Could not parse connection string format.');
    return;
  }

  const credentials = parts[1];
  const srvHost = parts[2]; // e.g. cluster0.6optnx7.mongodb.net
  const dbAndQuery = parts[3];

  try {
    // Create a custom DNS resolver that uses Google's public DNS (8.8.8.8)
    // This completely bypasses the Windows/ISP default DNS settings!
    const resolver = new dns.Resolver();
    resolver.setServers(['8.8.8.8', '1.1.1.1']);

    console.log(`Querying SRV records for _mongodb._tcp.${srvHost}...`);
    const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${srvHost}`);

    if (!srvRecords || srvRecords.length === 0) {
      throw new Error('Failed to resolve SRV records.');
    }

    const hosts = srvRecords.map(r => `${r.name}:${r.port}`);

    console.log(`Querying TXT records for ${srvHost}...`);
    const txtRecords = await resolver.resolveTxt(srvHost);
    
    let txtQuery = '';
    if (txtRecords && txtRecords.length > 0) {
      txtQuery = txtRecords[0].join(''); // e.g. "authSource=admin&replicaSet=atlas-..."
    }

    let finalQuery = txtQuery;
    if (!finalQuery.includes('tls=true') && !finalQuery.includes('ssl=true')) {
        finalQuery += '&tls=true';
    }

    const newUri = `mongodb://${credentials}@${hosts.join(',')}/${dbAndQuery.split('?')[0]}?${finalQuery}&retryWrites=true&w=majority&appName=Cluster0`;
    
    console.log('\nSuccessfully resolved direct IP addresses!');
    
    // Update .env.local
    envContent = envContent.replace(oldUri, newUri);
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ .env.local has been updated with the direct connection string to bypass your network firewall!');
    console.log('You can now run "npm run dev" or "npx -y tsx scripts/seed-projects.ts"');
    
  } catch (err) {
    console.error('Error resolving DNS with custom resolver:', err);
  }
}

fixMongoURI();
