import { useState } from 'react';
import Layout from '../components/Layout';
import { services } from '../data/services';
import Link from 'next/link';
import styles from '../styles/Pricing.module.css';

export default function Pricing() {
  const [selectedService, setSelectedService] = useState('web-design');

  const service = services.find(s => s.id === selectedService);

  return (
    <Layout>
      <h1>Pricing Plans</h1>
      <div className={styles.selector}>
        <label>Choose Service:</label>
        <select value={selectedService} onChange={e => setSelectedService(e.target.value)}>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      {service && (
        <div className={styles.packageGrid}>
          {Object.entries(service.packages).map(([key, pkg]) => (
            <div key={key} className={styles.packageCard}>
              <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              <p className={styles.price}>R {pkg.price.toLocaleString()}</p>
              <ul>
                {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <Link href={`/${service.id}`} className="btn btn-primary">Select</Link>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
