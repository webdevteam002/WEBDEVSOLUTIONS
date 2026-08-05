import { DashboardClient } from './DashboardClient';
import connectToDatabase from '@/lib/db';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let initialProjects: any[] = [];
  
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
    
    // Convert Mongoose documents to plain objects to pass to Client Component safely
    initialProjects = projects.map(p => ({
      _id: p._id.toString(),
      title: p.title,
      category: p.category,
      description: p.description,
      techStack: p.techStack,
      imageUrl: p.imageUrl,
    }));
  } catch (error) {
    console.error('Failed to fetch projects for dashboard:', error);
  }

  return <DashboardClient initialProjects={initialProjects} />;
}
