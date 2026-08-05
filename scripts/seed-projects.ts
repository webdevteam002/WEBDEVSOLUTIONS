import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  techStack: { type: [String], required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

const seedProjects = [
  {
    title: "Hamdard Enterprises",
    category: "Web App",
    description: "A comprehensive web application tailored for enterprise resource planning.",
    techStack: ["Next.js", "Node.js"],
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  },
  {
    title: "Interactive 3D Human Body Explorer",
    category: "3D & Interactive",
    description: "An educational platform featuring highly detailed 3D models of the human anatomy.",
    techStack: ["WebGL", "Three.js"],
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  },
  {
    title: "Ferrari - Luxury Interactive Web Experience",
    category: "Frontend UI",
    description: "A high-end, immersive promotional website emphasizing motion and aesthetic.",
    techStack: ["Framer Motion", "React"],
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  },
  {
    title: "Neurosurgeon Practice & Medical Portfolio",
    category: "Healthcare Tech",
    description: "A secure patient portal and professional portfolio for a medical practice.",
    techStack: ["MongoDB", "Express", "React", "Node.js"],
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  },
  {
    title: "Lost & Found Campus Management System",
    category: "Database Systems",
    description: "A digital ledger for tracking lost and found items across university grounds.",
    techStack: ["PHP", "MySQL"],
    imageUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
  }
];

async function seed() {
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Project.deleteMany({});
    console.log('Cleared existing projects');

    const result = await Project.insertMany(seedProjects);
    console.log(`Successfully seeded ${result.length} projects`);
  } catch (error) {
    console.error('Error seeding projects:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
