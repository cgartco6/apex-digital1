import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../lib/api';
import styles from '../styles/ProjectWizard.module.css';

export default function ProjectWizard({ service }) {
  const [step, setStep] = useState(1);
  const [package_, setPackage] = useState('basic');
  const [style, setStyle] = useState('modern');
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const stylesList = ['classic', 'cartoon', 'traditional', 'modern', 'futuristic', 'out-of-the-box'];

  const createProject = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/projects', {
        type: service.id,
        package: package_,
        style,
        requirements,
        price: service.packages[package_].price
      });
      // Add to cart or go directly to payment
      router.push(`/payment?projectId=${data.id}`);
    } catch (err) {
      alert('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className={styles.wizard}>
        <h3>Select Package</h3>
        <div className={styles.packages}>
          {Object.entries(service.packages).map(([key, pkg]) => (
            <button
              key={key}
              className={package_ === key ? styles.selected : ''}
              onClick={() => setPackage(key)}
            >
              <h4>{key}</h4>
              <p>R {pkg.price}</p>
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => setStep(2)}>Next</button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className={styles.wizard}>
        <h3>Choose Style</h3>
        <select value={style} onChange={e => setStyle(e.target.value)}>
          {stylesList.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => setStep(3)}>Next</button>
      </div>
    );
  }

  return (
    <div className={styles.wizard}>
      <h3>Describe Your Requirements</h3>
      <textarea
        rows={5}
        value={requirements}
        onChange={e => setRequirements(e.target.value)}
        placeholder="Tell us about your project..."
      />
      <button className="btn btn-primary" onClick={createProject} disabled={loading}>
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </div>
  );
                                        }
