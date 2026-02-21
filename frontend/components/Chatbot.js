import { useState } from 'react';
import axios from '../lib/api';
import styles from '../styles/Chatbot.module.css';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'You', text: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await axios.post('/chatbot', { message: input });
      const botMsg = { sender: 'Robyn', text: data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'Robyn', text: 'Sorry, I had an error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatbot}>
      <div className={styles.header} onClick={() => setOpen(!open)}>
        Robyn 🤖 {open ? '▼' : '▲'}
      </div>
      {open && (
        <div className={styles.body}>
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender === 'You' ? styles.userMsg : styles.botMsg}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))}
            {loading && <div className={styles.botMsg}>Robyn is typing...</div>}
          </div>
          <div className={styles.inputArea}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
      }
