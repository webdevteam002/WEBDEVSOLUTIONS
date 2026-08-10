require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function checkDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const projects = await db.collection('projects').find({}).toArray();
  projects.forEach(p => {
    console.log(`Title: ${p.title} \n Image: ${p.imageUrl}\n`);
  });
  mongoose.connection.close();
}

checkDB();
