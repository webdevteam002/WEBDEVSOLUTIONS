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

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <Scene1Hero />
      <Scene2Tension />
      <Scene3Services />
      <Scene4Process />
      <Scene5TechStack />
      <Scene6Portfolio />
      <Scene7Stats />
      <Scene8FAQ />
      <Scene9CTA />
      <Footer />
    </main>
  )
}
