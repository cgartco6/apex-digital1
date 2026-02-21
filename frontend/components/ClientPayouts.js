import styles from './ClientPayouts.module.css';

export default function ClientPayouts({ payouts, balance, adminView = false }) {
  if (adminView) {
    return (
      <section className={styles.payouts}>
        <h2>All Payouts</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Week</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(p => (
              <tr key={p.id}>
                <td>{p.User?.email || p.userId}</td>
                <td>{new Date(p.weekStart).toLocaleDateString()}</td>
                <td>R {p.totalAmount.toFixed(2)}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Total platform balance (retained): R {balance.retained?.toFixed(2) || '0.00'}</p>
      </section>
    );
  }

  // Original client view (unchanged)
  return (
    <section className={styles.payouts}>
      <h2>Your Payouts</h2>
      {/* ... existing code ... */}
    </section>
  );
      }
