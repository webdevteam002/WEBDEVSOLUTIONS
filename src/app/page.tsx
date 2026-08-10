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
import connectToDatabase from '@/lib/db'
import Project from '@/models/Project'

export default async function Home() {
  // Force-injected 5 projects — the exact set required
  const fallbackProjects = [
    { id: '1', title: "Interactive 3D Human Body Explorer", category: "Web Development", description: "Architected an interactive 3D anatomy visualization tool with real-time rotation, zoom, and structure inspection.", tech: ["WebGL", "Three.js"], link: null, imageFallback: "/human body explorer.jpeg" },
    { id: '2', title: "Ferrari Digital Experience", category: "Web Development", description: "Designed a high-end vehicle showcase inspired by minimalist Apple and Ferrari digital aesthetics.", tech: ["Framer Motion", "CSS3"], link: null, imageFallback: "/Ferrari luxury.jpeg" },
    { id: '3', title: "Neurosurgeon Medical Portfolio", category: "Web Development", description: "Developed a custom healthcare web application with dynamic patient consultation forms.", tech: ["React", "Node.js"], link: null, imageFallback: "/neuro surgeon.jpeg" },
    { id: '4', title: "Campus Management System", category: "Web Development", description: "Built a centralized campus registry with secure authentication, role-based access, and CRUD operations.", tech: ["PHP", "MySQL"], link: null, imageFallback: "/lost and found management system.jpeg" },
    { id: '5', title: "Hamdard", category: "Web Development", description: "Engineered and deployed a production-grade enterprise web application with fully fluid mobile layout and sub-second page performance.", tech: ["Next.js", "Node.js"], link: "https://www.webdevsolutions.online", imageFallback: "/hamdard.png" },
  ]

  // Try MongoDB, fall back to hardcoded projects
  let portfolioProjects = fallbackProjects
  try {
    await connectToDatabase()
    const dbProjects = await Project.find({}).sort({ createdAt: -1 }).lean()
    if (dbProjects.length > 0) {
      portfolioProjects = dbProjects.map(p => {
        const matchingFallback = fallbackProjects.find(
          fp => fp.title.toLowerCase() === p.title.toLowerCase()
        );
        const customImage = (!p.imageUrl || p.imageUrl === '/logo-parts/pixels.webp')
          ? (matchingFallback?.imageFallback || undefined)
          : p.imageUrl;
        
        return {
          id: p._id.toString(),
          title: p.title,
          category: p.category,
          description: p.description,
          tech: p.techStack || [],
          link: (p.title.toLowerCase().includes('hamdard') ? "https://www.webdevsolutions.online" : null) || p.link || null,
          imageFallback: customImage,
        };
      })
    }
  } catch (error) {
    console.warn('Failed to fetch projects from MongoDB:', error)
  }

  return (
    <main className="flex min-h-screen flex-col relative bg-[#0A0E1A]">
      <Navbar />
      <SectionIndex />
      <Scene1Hero />
      <Scene2Tension />
      <Scene3Services />
      <Scene4Process />
      <Scene5TechStack />
      <Scene6Portfolio projects={portfolioProjects} />
      <Scene7Proof />
      <Scene8FAQ />
      <Scene9CTA />
      <Footer />
    </main>
  )
}
