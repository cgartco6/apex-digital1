import { services } from '../data/services';
import ServiceCard from '../components/ServiceCard';
import Layout from '../components/Layout';

export default function Services() {
  return (
    <Layout>
      <h1>Our AI‑Powered Services</h1>
      <div className="services-grid">
        {services.map(s => <ServiceCard key={s.id} service={s} />)}
      </div>
    </Layout>
  );
}
