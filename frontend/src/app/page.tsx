import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import OrgPsychology from '@/components/OrgPsychology/OrgPsychology'
import Services from '@/components/Services/Services'
import ServicesAndTeam from '@/components/ServicesAndTeam/ServicesAndTeam'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <OrgPsychology />
      <Services />
      <ServicesAndTeam />
    </main>
  )
}
