import Layout from '../components/Layout';
import styles from '../styles/Compliance.module.css';

export default function Compliance() {
  return (
    <Layout>
      <h1>Compliance & Legal</h1>
      <div className={styles.content}>
        <section>
          <h2>South African Compliance (POPIA)</h2>
          <p>We comply with the Protection of Personal Information Act (POPIA). All client data is collected with consent, processed securely, and never shared without authorization.</p>
        </section>
        <section>
          <h2>Global Compliance (GDPR)</h2>
          <p>For our international clients, we adhere to the General Data Protection Regulation (GDPR). You have the right to access, rectify, and erase your data.</p>
        </section>
        <section>
          <h2>Payment Security</h2>
          <p>All payments are processed through PCI‑DSS compliant gateways: Stripe, PayFast, and Valr. We do not store credit card details.</p>
        </section>
        <section>
          <h2>Terms of Service</h2>
          <p>By using our services, you agree to our <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a>.</p>
        </section>
      </div>
    </Layout>
  );
    }
