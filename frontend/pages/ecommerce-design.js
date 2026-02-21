import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { services } from '../data/services';
import toast from 'react-hot-toast';
import styles from '../styles/ServiceDetail.module.css';

export default function EcommerceDesign() {
  const router = useRouter();
  const service = services.find(s => s.id === 'ecommerce-design');
  const [selectedPackage, setSelectedPackage] = useState('basic');

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === `ecommerce-${selectedPackage}`);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: `ecommerce-${selectedPackage}`,
        name: `E‑commerce Design (${selectedPackage})`,
        price: service.packages[selectedPackage].price,
        quantity: 1,
        type: 'service'
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart');
    router.push('/cart');
  };

  if (!service) return <Layout>Service not found</Layout>;

  return (
    <Layout>
      <h1>{service.name}</h1>
      <p className={styles.description}>{service.description}</p>
      <div className={styles.packageGrid}>
        {Object.entries(service.packages).map(([key, pkg]) => (
          <div
            key={key}
            className={`${styles.packageCard} ${selectedPackage === key ? styles.selected : ''}`}
            onClick={() => setSelectedPackage(key)}
          >
            <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
            <p className={styles.price}>R {pkg.price.toLocaleString()}</p>
            <ul>
              {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
    </Layout>
  );
}
