import { useState } from 'react';
import Layout from '../components/Layout';
import axios from '../lib/api';
import toast from 'react-hot-toast';
import styles from '../styles/SocialStudio.module.css';

export default function SocialStudio() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [tone, setTone] = useState('professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/social/generate-content', { topic, platform, tone });
      setGeneratedContent(data.content);
    } catch (err) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/social/generate-image', { description: imageDescription, style: 'modern' });
      setImageUrl(data.imageUrl);
    } catch (err) {
      toast.error('Image generation failed');
    } finally {
      setLoading(false);
    }
  };

  const postNow = async () => {
    setLoading(true);
    try {
      await axios.post('/social/post', { platform, content: generatedContent, imageUrl });
      toast.success('Posted successfully!');
    } catch (err) {
      toast.error('Post failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1>AI Social Media Studio</h1>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>Generate Content</h2>
          <input placeholder="Topic" value={topic} onChange={e => setTopic(e.target.value)} />
          <select value={platform} onChange={e => setPlatform(e.target.value)}>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
          </select>
          <select value={tone} onChange={e => setTone(e.target.value)}>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
          </select>
          <button onClick={generateContent} disabled={loading}>Generate</button>
          <textarea value={generatedContent} readOnly rows={5} />
        </div>
        <div className={styles.card}>
          <h2>Generate Image</h2>
          <input placeholder="Describe the image" value={imageDescription} onChange={e => setImageDescription(e.target.value)} />
          <button onClick={generateImage} disabled={loading}>Generate</button>
          {imageUrl && <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%' }} />}
        </div>
      </div>
      {generatedContent && imageUrl && (
        <div className={styles.post}>
          <button onClick={postNow} className="btn btn-primary">Post Now</button>
        </div>
      )}
    </Layout>
  );
  }
