import { Scene1Hero } from '@/components/scenes/Scene1Hero'
import { Scene2Tension } from '@/components/scenes/Scene2Tension'
import { Scene3Services } from '@/components/scenes/Scene3Services'
import { Scene4Process } from '@/components/scenes/Scene4Process'
import { Scene5TechStack } from '@/components/scenes/Scene5TechStack'
import { Scene6Portfolio } from '@/components/scenes/Scene6Portfolio'
import { Scene7Stats } from '@/components/scenes/Scene7Stats'
import { Scene8FAQ } from '@/components/scenes/Scene8FAQ'
import { Scene9CTA } from '@/components/scenes/Scene9CTA'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { AnimatedLogo } from '@/components/3d/AnimatedLogo'
import { ServiceType } from '@/components/scenes/Scene3Services'

export interface ProjectType {
  _id: string;
  title: string;
  category: string;
  tech: string;
  link: string | null;
  imageUrl: string | null;
}
import connectToDatabase from '@/lib/db'
import Project from '@/models/Project'

export default async function Home() {
  let mongoProjects: ProjectType[] = []

  try {
    await connectToDatabase()
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean()
    mongoProjects = projects.map(p => ({
      _id: p._id.toString(),
      title: p.title,
      category: p.category,
      tech: p.techStack.join(', '),
      link: null,
      imageUrl: p.imageUrl
    }))
  } catch (error) {
    console.warn('Failed to fetch projects from MongoDB:', error)
  }



  const projects = mongoProjects.length > 0 ? mongoProjects : [
    { _id: '1', title: "Hamdard Enterprises", category: "Web App", tech: "Next.js, Node.js", link: "https://hamdardenterprises.vercel.app/", imageUrl: "/hamdard.png" },
    { _id: '2', title: "Interactive 3D Human Body Explorer", category: "3D & Interactive", tech: "WebGL, Three.js", link: null, imageUrl: null },
    { _id: '3', title: "Ferrari - Luxury Interactive Web Experience", category: "Frontend UI", tech: "Framer Motion", link: null, imageUrl: null },
    { _id: '4', title: "Neurosurgeon Practice & Medical Portfolio", category: "Healthcare Tech", tech: "MERN stack", link: null, imageUrl: null },
    { _id: '5', title: "Lost & Found Campus Management System", category: "Database Systems", tech: "PHP, MySQL", link: null, imageUrl: null },
  ];
  return (
    <main className="flex min-h-screen flex-col overflow-hidden relative">
      <Navbar />
      <div className="fixed inset-0 z-[-1] pointer-events-none flex items-center justify-center">
        <AnimatedLogo />
      </div>
      <Scene1Hero />
      <Scene2Tension />
      <Scene3Services />
      <Scene4Process />
      <Scene5TechStack />
      <Scene6Portfolio projects={projects} />
      <Scene7Stats />
      <Scene8FAQ />
      <Scene9CTA />
      <Footer />
    </main>
  )
}
