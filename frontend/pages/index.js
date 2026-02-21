import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { services } from '../data/services';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState([]);

  useEffect(() => {
    setFeaturedServices(services.slice(0, 3));
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Apex Digital – AI‑Powered Design & Marketing</h1>
        <p>Transform your brand with advanced AI agents, real‑time analytics, and revenue‑driven campaigns.</p>
        <Link href="/services" className="btn btn-primary">Get Started</Link>
      </section>

      {/* Featured Services */}
      <section className={styles.featured}>
        <h2>Our Services</h2>
        <div className={styles.grid}>
          {featuredServices.map(service => (
            <div key={service.id} className={styles.card}>
              <div className={styles.icon}>{service.icon}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <Link href={`/${service.id}`} className="btn btn-secondary">Learn More</Link>
            </div>
          ))}
        </div>
      </section>

      {/* AI Studios Preview */}
      <section className={styles.studios}>
        <div className={styles.studioCard}>
          <h3>AI Design Studio</h3>
          <p>Generate stunning visuals, posters, wraps, and more with our creative AI.</p>
          <Link href="/ai-design-studio" className="btn btn-primary">Try Now</Link>
        </div>
        <div className={styles.studioCard}>
          <h3>AI Marketing Studio</h3>
          <p>Launch data‑driven campaigns, predict ROI, and optimize with AI.</p>
          <Link href="/ai-marketing-studio" className="btn btn-primary">Try Now</Link>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div>
          <h3>500+</h3>
          <p>Projects Delivered</p>
        </div>
        <div>
          <h3>98%</h3>
          <p>Client Satisfaction</p>
        </div>
        <div>
          <h3>24/7</h3>
          <p>AI Support</p>
        </div>
      </section>
    </Layout>
  );
    }
