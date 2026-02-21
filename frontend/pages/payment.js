import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from '../lib/api';
import toast from 'react-hot-toast';
import styles from '../styles/Payment.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('stripe');
  const [projectId, setProjectId] = useState(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // In a real app, you'd get project details from query or state
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setAmount(total);
    // For demo, create a dummy project ID
    setProjectId('temp-' + Date.now());
  }, []);

  const handleStripePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { data } = await axios.post('/payments/create-intent', {
        projectId,
        method: 'stripe',
        amount
      });

      const { error } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Payment successful!');
        localStorage.removeItem('cart');
        router.push('/client-dashboard');
      }
    } catch (err) {
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePayFast = () => {
    // Redirect to PayFast
    axios.post('/payments/create-intent', { projectId, method: 'payfast', amount })
      .then(res => {
        // res.data.form is HTML form – submit it
        const form = document.createElement('form');
        form.innerHTML = res.data.form;
        document.body.appendChild(form);
        form.submit();
      });
  };

  const handleCrypto = () => {
    axios.post('/payments/create-intent', { projectId, method: 'crypto', amount })
      .then(res => {
        // Show crypto invoice details
        toast.success(`Send ${res.data.invoice.amount} ${res.data.invoice.currency} to ${res.data.invoice.address}`);
      });
  };

  return (
    <div className={styles.paymentContainer}>
      <h2>Payment Details</h2>
      <p>Total: R {amount.toLocaleString()}</p>

      <div className={styles.methods}>
        <button onClick={() => setMethod('stripe')} className={method === 'stripe' ? styles.active : ''}>Credit Card</button>
        <button onClick={() => setMethod('payfast')} className={method === 'payfast' ? styles.active : ''}>PayFast</button>
        <button onClick={() => setMethod('crypto')} className={method === 'crypto' ? styles.active : ''}>Crypto</button>
        <button onClick={() => setMethod('eft')} className={method === 'eft' ? styles.active : ''}>EFT</button>
      </div>

      {method === 'stripe' && (
        <form onSubmit={handleStripePayment}>
          <CardElement options={{ hidePostalCode: true }} />
          <button type="submit" disabled={!stripe || loading} className="btn btn-primary">
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      )}

      {method === 'payfast' && (
        <button onClick={handlePayFast} className="btn btn-primary">Pay with PayFast</button>
      )}

      {method === 'crypto' && (
        <button onClick={handleCrypto} className="btn btn-primary">Generate Crypto Invoice</button>
      )}

      {method === 'eft' && (
        <div>
          <p>Bank details:</p>
          <p>FNB Account: 123456789<br />Branch: 250655<br />Reference: {projectId}</p>
          <p>Please upload proof of payment after transfer.</p>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Layout>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </Layout>
  );
}
