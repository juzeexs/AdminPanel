import styles from './Dashboard.module.css';
import StatCards from '../components/Cards/StatCards';
import Charts from '../components/Charts/Charts';
import Table from '../components/Table/Table';

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <StatCards />
      <Charts />
      <Table />
    </div>
  );
}
