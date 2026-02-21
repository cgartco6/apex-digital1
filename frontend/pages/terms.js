import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from '../lib/api';
import styles from '../styles/Legal.module.css';

export default function Terms() {
  const [content, setContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const { data } = await axios.get('/legal/terms');
      setContent(data.content);
      setLastUpdated(data.updatedAt);
    } catch (err) {
      setContent('Error loading terms.');
    }
  };

  return (
    <Layout>
      <h1>Terms of Service</h1>
      {lastUpdated && <p className={styles.lastUpdated}>Last updated: {new Date(lastUpdated).toLocaleDateString()}</p>}
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
    }
