import styles from './OwnerStats.module.css'; // or reuse admin.module.css

export default function OwnerStats({ current }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <h3>Total Clients</h3>
        <p className={styles.statValue}>{current.totalClients}</p>
      </div>
      <div className={styles.statCard}>
        <h3>Total Revenue</h3>
        <p className={styles.statValue}>{formatCurrency(current.totalRevenue)}</p>
      </div>
      <div className={styles.statCard}>
        <h3>Pending Payouts</h3>
        <p className={styles.statValue}>{formatCurrency(current.pendingPayouts)}</p>
      </div>
      <div className={styles.statCard}>
        <h3>Active Projects</h3>
        <p className={styles.statValue}>{current.activeProjects}</p>
      </div>
    </div>
  );
}
