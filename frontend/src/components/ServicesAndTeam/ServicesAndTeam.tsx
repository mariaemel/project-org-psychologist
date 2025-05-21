import ServicesIndividuals from '@/components/ServicesIndividuals/ServicesIndividuals';
import ServicesBusinesses from '@/components/ServicesBusinesses/ServicesBusinesses';
import TeamWorkSection from '@/components/TeamBoost/TeamBoost';
import styles from './ServicesAndTeam.module.css';

export default function ServicesAndTeamwork() {
  return (
    <div className={styles.wrapper}>

      <div className={styles.content}>
        <TeamWorkSection />
      </div>
    </div>
  );
}
