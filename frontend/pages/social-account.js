import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from '../lib/api';
import styles from '../styles/SocialAccounts.module.css';

export default function SocialAccounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const { data } = await axios.get('/social-accounts');
    setAccounts(data);
  };

  const connect = async (platform) => {
    const { data } = await axios.get(`/oauth/${platform}`);
    window.location.href = data.url; // Redirect to OAuth provider
  };

  const disconnect = async (id) => {
    await axios.delete(`/social-accounts/${id}`);
    fetchAccounts();
  };

  return (
    <Layout>
      <h1>Connected Social Accounts</h1>
      <div className={styles.grid}>
        {['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok'].map(platform => (
          <div key={platform} className={styles.card}>
            <h2>{platform}</h2>
            {accounts.filter(a => a.platform === platform).length === 0 ? (
              <button onClick={() => connect(platform)}>Connect</button>
            ) : (
              <div>
                {accounts.filter(a => a.platform === platform).map(acc => (
                  <div key={acc.id}>
                    <span>{acc.accountName}</span>
                    <button onClick={() => disconnect(acc.id)}>Disconnect</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
    }
