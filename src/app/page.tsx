import { Scene1Hero } from '@/components/scenes/Scene1Hero'
import { Scene2Tension } from '@/components/scenes/Scene2Tension'
import { Scene3Services } from '@/components/scenes/Scene3Services'
import { Scene4Process } from '@/components/scenes/Scene4Process'
import { Scene5TechStack } from '@/components/scenes/Scene5TechStack'
import { Scene6Portfolio } from '@/components/scenes/Scene6Portfolio'
import { Scene7Proof } from '@/components/scenes/Scene7Proof'
import { Scene8FAQ } from '@/components/scenes/Scene8FAQ'
import { Scene9CTA } from '@/components/scenes/Scene9CTA'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SectionIndex } from '@/components/ui/SectionIndex'
import { ServiceType } from '@/components/scenes/Scene3Services'

export interface ProjectType {
  id: string;
  title: string;
  category: string;
  tech: string;
  link: string | null;
  imageUrl: string | null;
  description: string;
}
import connectToDatabase from '@/lib/db'
import Project from '@/models/Project'

export default async function Home() {
  let mongoProjects: ProjectType[] = []

  try {
    await connectToDatabase()
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean()
    mongoProjects = projects.map(p => ({
      id: p._id.toString(),
      title: p.title,
      category: p.category,
      tech: p.techStack.join(', '),
      link: null,
      imageUrl: p.imageUrl,
      description: "A custom project developed for our client."
    }))
  } catch (error) {
    console.warn('Failed to fetch projects from MongoDB:', error)
  }



  const fallbackProjects = [
    { id: '1', title: "Interactive 3D Human Body Explorer", category: "3D & Interactive", tech: "WebGL, Three.js", link: null, imageUrl: null, description: "Architected an interactive 3D anatomy visualization tool with real-time rotation, zoom, and structure inspection." },
    { id: '2', title: "Ferrari Digital Experience", category: "Frontend UI", tech: "Framer Motion", link: null, imageUrl: null, description: "Designed a high-end vehicle showcase inspired by minimalist Apple and Ferrari digital aesthetics." },
    { id: '3', title: "Neurosurgeon Medical Portfolio", category: "Healthcare Tech", tech: "React, Node.js", link: null, imageUrl: null, description: "Developed a custom healthcare web application with dynamic patient consultation forms." },
    { id: '4', title: "Campus Management System", category: "Database Systems", tech: "PHP, MySQL", link: null, imageUrl: null, description: "Built a centralized campus registry with secure authentication, role-based access, and CRUD operations." },
    { id: '5', title: "Hamdard", category: "Web App", tech: "Next.js, Node.js", link: "https://hamdardenterprises.vercel.app/", imageUrl: "/hamdard.png", description: "Engineered and deployed a production-grade enterprise web application with fully fluid mobile layout and sub-second page performance." },
  ];

  const projects = mongoProjects.length > 0 ? mongoProjects : fallbackProjects;
  return (
    <main className="flex min-h-screen flex-col overflow-hidden relative">
      <Navbar />
      <SectionIndex />
      <Scene1Hero />
      <Scene2Tension />
      <Scene3Services />
      <Scene4Process />
      <Scene5TechStack />
      <Scene6Portfolio projects={projects.map(p => ({ ...p, tech: p.tech.split(', ') }))} />
      <Scene7Proof />
      <Scene8FAQ />
      <Scene9CTA />
      <Footer />
    </main>
  )
}
