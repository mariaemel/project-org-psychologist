import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import OrgPsychology from '@/components/OrgPsychology/OrgPsychology'
import ServicesIndividuals from '@/components/ServicesIndividuals/ServicesIndividuals'
import ServicesBusinesses from '@/components/ServicesBusinesses/ServicesBusinesses'
import TeamBoost from '@/components/TeamBoost/TeamBoost'
import ServicesAndTeam from '@/components/ServicesAndTeam/ServicesAndTeam'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <OrgPsychology />
      <ServicesAndTeam />
    </main>
  )
}
