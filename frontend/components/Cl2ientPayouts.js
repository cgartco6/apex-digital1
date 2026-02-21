import styles from './ClientPayouts.module.css';

export default function ClientPayouts({ payouts, balance }) {
  return (
    <section className={styles.payouts}>
      <h2>Payouts & Balance</h2>
      <div className={styles.balanceCard}>
        <h3>Current Retained Balance</h3>
        <p className={styles.balance}>R {balance.retained?.toFixed(2) || '0.00'}</p>
        <p className={styles.note}>*Retained earnings accumulate and are never paid out.</p>
      </div>

      {payouts.length === 0 ? (
        <p>No payouts yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Week Starting</th>
              <th>Total Amount</th>
              <th>Breakdown</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(p => (
              <tr key={p.id}>
                <td>{new Date(p.weekStart).toLocaleDateString()}</td>
                <td>R {p.totalAmount.toFixed(2)}</td>
                <td>
                  <ul className={styles.breakdown}>
                    <li>FNB: 35%</li>
                    <li>African Bank: 15%</li>
                    <li>AI FNB: 20%</li>
                    <li>Reserve FNB: 20%</li>
                    <li>Retained: 10%</li>
                  </ul>
                </td>
                <td>
                  <span className={`${styles.status} ${styles[p.status]}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
    }
