import fs from 'fs';
import path from 'path';

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
  console.log('Found mongodb+srv string. Analyzing DNS to bypass local block...');

  // Extract credentials and hostname
  // mongodb+srv://username:password@cluster0.xxx.mongodb.net/dbname?opts
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
    // 1. Resolve SRV record via Google DNS-over-HTTPS
    const srvUrl = `https://dns.google/resolve?name=_mongodb._tcp.${srvHost}&type=SRV`;
    console.log(`Querying ${srvUrl}...`);
    const srvRes = await fetch(srvUrl).then(r => r.json());

    if (!srvRes.Answer || srvRes.Answer.length === 0) {
      throw new Error('Failed to resolve SRV records from Google DNS.');
    }

    // data format: "priority weight port target" -> "0 0 27017 ac-ab12cd-shard-00-00..."
    const hosts = srvRes.Answer.map((a: any) => {
      const parts = a.data.split(' ');
      return `${parts[3].replace(/\.$/, '')}:${parts[2]}`;
    });

    // 2. Resolve TXT record for authSource and replicaSet
    const txtUrl = `https://dns.google/resolve?name=${srvHost}&type=TXT`;
    console.log(`Querying ${txtUrl}...`);
    const txtRes = await fetch(txtUrl).then(r => r.json());
    
    let txtQuery = '';
    if (txtRes.Answer && txtRes.Answer.length > 0) {
      txtQuery = txtRes.Answer[0].data.replace(/"/g, ''); // "authSource=admin&replicaSet=atlas-..."
    }

    // 3. Construct the unrolled standard URI
    // Include existing query params but override with TXT record requirements
    let finalQuery = txtQuery;
    
    // Add tls=true which is required for Atlas
    if (!finalQuery.includes('tls=true') && !finalQuery.includes('ssl=true')) {
        finalQuery += '&tls=true';
    }

    const newUri = `mongodb://${credentials}@${hosts.join(',')}/${dbAndQuery.split('?')[0]}?${finalQuery}&retryWrites=true&w=majority&appName=Cluster0`;
    
    console.log('\nSuccessfully resolved direct IP addresses!');
    
    // 4. Update .env.local
    envContent = envContent.replace(oldUri, newUri);
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ .env.local has been updated with the direct connection string to bypass your network firewall!');
    console.log('You can now run "npm run dev" or "npx -y tsx scripts/seed-projects.ts"');
    
  } catch (err) {
    console.error('Error resolving DNS:', err);
  }
}

fixMongoURI();
