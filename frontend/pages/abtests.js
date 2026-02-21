import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PostVariantCreator from '../components/PostVariantCreator';
import axios from '../lib/api';
import styles from '../styles/ABTests.module.css';

export default function ABTests() {
  const [tests, setTests] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    variants: [{ content: '', imageUrl: '' }],
    platforms: [],
    audienceSize: 1000
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    const { data } = await axios.get('/abtests');
    setTests(data);
  };

  const createTest = async () => {
    await axios.post('/abtests', newTest);
    setShowCreate(false);
    fetchTests();
  };

  const startTest = async (id) => {
    await axios.post(`/abtests/${id}/start`);
    fetchTests();
  };

  const viewResults = async (id) => {
    const { data } = await axios.get(`/abtests/${id}/results`);
    alert(JSON.stringify(data));
  };

  return (
    <Layout>
      <h1>A/B Tests</h1>
      <button onClick={() => setShowCreate(true)}>New Test</button>
      {showCreate && (
        <div className={styles.modal}>
          <h2>Create A/B Test</h2>
          <input placeholder="Test Name" value={newTest.name} onChange={e => setNewTest({...newTest, name: e.target.value})} />
          <PostVariantCreator variants={newTest.variants} setVariants={v => setNewTest({...newTest, variants: v})} />
          <select multiple value={newTest.platforms} onChange={e => setNewTest({...newTest, platforms: Array.from(e.target.selectedOptions, opt => opt.value)})}>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
          </select>
          <input type="number" placeholder="Audience Size" value={newTest.audienceSize} onChange={e => setNewTest({...newTest, audienceSize: e.target.value})} />
          <button onClick={createTest}>Create</button>
          <button onClick={() => setShowCreate(false)}>Cancel</button>
        </div>
      )}
      <div className={styles.testList}>
        {tests.map(test => (
          <div key={test.id} className={styles.card}>
            <h3>{test.name}</h3>
            <p>Status: {test.status}</p>
            {test.status === 'draft' && <button onClick={() => startTest(test.id)}>Start</button>}
            {test.status === 'completed' && <button onClick={() => viewResults(test.id)}>View Results</button>}
          </div>
        ))}
      </div>
    </Layout>
  );
    }
