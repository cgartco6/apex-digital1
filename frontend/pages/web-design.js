import { useState } from 'react';
import { useRouter } from 'next/router';
import { services } from '../data/services';
import Layout from '../components/Layout';

export default function WebDesign() {
  const router = useRouter();
  const service = services.find(s => s.id === 'web-design');
  const [selectedPackage, setSelectedPackage] = useState('basic');

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = {
      id: `web-${selectedPackage}`,
      name: `Web Design (${selectedPackage})`,
      price: service.packages[selectedPackage].price,
      quantity: 1,
      type: 'service'
    };
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    router.push('/cart');
  };

  return (
    <Layout>
      <h1>{service.name}</h1>
      <p>{service.description}</p>
      <div className="package-grid">
        {Object.entries(service.packages).map(([key, pkg]) => (
          <div key={key} className={`package-card ${selectedPackage === key ? 'selected' : ''}`}>
            <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
            <p className="price">R {pkg.price}</p>
            <ul>
              {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <button onClick={() => setSelectedPackage(key)}>Select</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
    </Layout>
  );
  }
