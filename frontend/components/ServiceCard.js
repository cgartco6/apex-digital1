import Link from 'next/link';
import styles from './ServiceCard.module.css';

export default function ServiceCard({ service }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{service.icon}</div>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <Link href={`/${service.id}`} className="btn btn-secondary">
        View Packages
      </Link>
    </div>
  );
  }
