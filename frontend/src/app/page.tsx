import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import OrgPsychology from '@/components/OrgPsychology/OrgPsychology'
import Services from '@/components/Services/Services'
import ServicesAndTeam from '@/components/ServicesAndTeam/ServicesAndTeam'
import Breadcrumbs from '@/components/Header/Breadcrumbs';

export default function HomePage() {
  return (
    <main>
      <Breadcrumbs />
      <Hero />
      <About />
      <OrgPsychology />
      <Services />
      <ServicesAndTeam />
    </main>
  )
}
