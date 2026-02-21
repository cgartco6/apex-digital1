import Layout from '../components/Layout';
import ServiceCard from '../components/ServiceCard';
import { services } from '../data/services';
import styles from '../styles/Services.module.css';

export default function Services() {
  return (
    <Layout>
      <h1>Our AI‑Powered Services</h1>
      <p className={styles.subtitle}>Choose from a wide range of design and marketing solutions</p>
      <div className={styles.grid}>
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </Layout>
  );
  }
