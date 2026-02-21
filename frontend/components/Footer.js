import Link from 'next/link';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2025 Apex Digital. All rights reserved.</p>
      <Link href="/compliance">Compliance</Link>
      <Link href="/terms">Terms</Link>
      <Link href="/privacy">Privacy</Link>
    </footer>
  );
    }
