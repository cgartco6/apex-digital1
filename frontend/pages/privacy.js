import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from '../lib/api';
import styles from '../styles/Legal.module.css';

export default function Privacy() {
  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrivacy();
  }, []);

  const fetchPrivacy = async () => {
    try {
      const { data } = await axios.get('/legal/privacy');
      setContent(data.content);
      setLastUpdated(data.updatedAt);
    } catch (err) {
      console.error('Failed to load privacy policy:', err);
      setError('Failed to load privacy policy. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loading}>Loading privacy policy...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.error}>{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Privacy Policy</h1>
      {lastUpdated && (
        <p className={styles.lastUpdated}>
          Last updated: {new Date(lastUpdated).toLocaleDateString()}
        </p>
      )}
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
                 }
