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
import { sanityFetch } from '@/sanity/lib/fetch'
import { servicesQuery } from '@/sanity/lib/queries'
import { ServiceType } from '@/components/scenes/Scene3Services'
import { ProjectType } from '@/components/scenes/Scene6Portfolio'
import connectToDatabase from '@/lib/db'
import Project from '@/models/Project'

export default async function Home() {
  let sanityServices: ServiceType[] = []
  let mongoProjects: ProjectType[] = []

  try {
    sanityServices = await sanityFetch<ServiceType[]>({ query: servicesQuery, tags: ['service'] })
  } catch (error) {
    console.warn('Failed to fetch from Sanity CMS (Ensure Project ID is set):', error)
  }

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

  // Fallbacks while CMS is empty
  const services = sanityServices.length > 0 ? sanityServices : [
    { _id: '1', title: "Custom Web Application Development", order: 1, description: "We design and build custom web applications tailored to your workflows, ensuring scalable architecture and exceptional user experiences.", techStack: ["React", "Next.js", "Node.js"] },
    { _id: '2', title: "SaaS Application Development", order: 2, description: "End-to-end SaaS platforms built for multi-tenancy, high availability, and rapid scaling with automated billing integrations.", techStack: ["Stripe", "PostgreSQL", "Redis"] },
    { _id: '3', title: "Desktop Application Development", order: 3, description: "Cross-platform desktop solutions delivering native performance and deep OS integration for complex business requirements.", techStack: ["Electron", "Tauri", "Rust"] },
    { _id: '4', title: "Progressive Web App (PWA) Development", order: 4, description: "App-like experiences directly in the browser, featuring offline capabilities, push notifications, and ultra-fast load times.", techStack: ["Service Workers", "Web App Manifest", "IndexedDB"] },
    { _id: '5', title: "AI Solutions & Integration", order: 5, description: "Injecting powerful machine learning models and generative AI into your products to automate tasks and unlock new capabilities.", techStack: ["OpenAI", "LangChain", "Python"] },
    { _id: '6', title: "API Development & Integration", order: 6, description: "Robust REST and GraphQL APIs designed for secure, high-throughput data exchange between your microservices and third parties.", techStack: ["GraphQL", "Express", "Docker"] },
    { _id: '7', title: "E-Commerce Website Development", order: 7, description: "High-conversion headless commerce architectures optimizing the entire customer journey from product discovery to checkout.", techStack: ["Next.js", "Medusa", "Stripe"] },
    { _id: '8', title: "Business & Corporate Websites", order: 8, description: "Premium, highly optimized marketing sites and corporate landing pages engineered to establish authority and drive leads.", techStack: ["Sanity", "Framer Motion", "Tailwind"] },
    { _id: '9', title: "WordPress Development", order: 9, description: "Custom themes and plugins tailored for performance and security, breaking free from bloated templates.", techStack: ["PHP", "MySQL", "WP-CLI"] },
    { _id: '10', title: "Shopify Development", order: 10, description: "Bespoke Shopify storefronts integrating advanced inventory APIs and highly customized liquid layouts.", techStack: ["Liquid", "Hydrogen", "Oxygen"] }
  ];

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
      <Scene3Services services={services} />
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
