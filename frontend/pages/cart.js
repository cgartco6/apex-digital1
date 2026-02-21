import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { FiTrash2 } from 'react-icons/fi';
import styles from '../styles/Cart.module.css';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(stored);
  };

  const updateQuantity = (id, delta) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = () => {
    if (cart.length === 0) return;
    router.push('/payment');
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link href="/services" className="btn btn-primary">Browse Services</Link>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Your Cart</h1>
      <div className={styles.cartItems}>
        {cart.map(item => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.details}>
              <h3>{item.name}</h3>
              <p>R {item.price.toLocaleString()}</p>
            </div>
            <div className={styles.quantity}>
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>
            <button className={styles.remove} onClick={() => removeItem(item.id)}>
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
      <div className={styles.summary}>
        <h3>Total: R {total.toLocaleString()}</h3>
        <button onClick={checkout} className="btn btn-primary">Proceed to Checkout</button>
      </div>
    </Layout>
  );
                             }
