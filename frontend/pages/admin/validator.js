import { useState } from 'react';
import Layout from '../../components/Layout';
import axios from '../../lib/api';
import toast from 'react-hot-toast';
import styles from '../../styles/Admin.module.css';

export default function ValidatorPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runValidation = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/validator/run');
      setResults(data);
    } catch (err) {
      toast.error('Validation failed');
    } finally {
      setLoading(false);
    }
  };

  const runFix = async () => {
    setLoading(true);
    try {
      await axios.post('/validator/fix');
      toast.success('Auto‑fix completed');
    } catch (err) {
      toast.error('Fix failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1>Code Validator</h1>
      <button onClick={runValidation} disabled={loading}>Run Validation</button>
      <button onClick={runFix} disabled={loading}>Auto‑Fix</button>
      {results && (
        <pre className={styles.results}>{JSON.stringify(results, null, 2)}</pre>
      )}
    </Layout>
  );
        }
