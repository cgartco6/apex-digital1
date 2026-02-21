import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>Apex Digital</Link>
      <ul className={styles.navLinks}>
        <li><Link href="/services">{t('services')}</Link></li>
        <li><Link href="/ai-design-studio">AI Design</Link></li>
        <li><Link href="/ai-marketing-studio">AI Marketing</Link></li>
        <li><Link href="/cart">🛒</Link></li>
        {user ? (
          <>
            <li><Link href="/client-dashboard">{t('dashboard')}</Link></li>
            {user.role === 'admin' && <li><Link href="/admin/dashboard">Admin</Link></li>}
            <li><button onClick={logout}>{t('logout')}</button></li>
          </>
        ) : (
          <>
            <li><Link href="/login">{t('login')}</Link></li>
            <li><Link href="/register">{t('register')}</Link></li>
          </>
        )}
        <li><LanguageSwitcher /></li>
      </ul>
    </nav>
  );
    }
