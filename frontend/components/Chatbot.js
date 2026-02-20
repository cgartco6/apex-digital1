import { useState } from 'react';
import axios from '../lib/api';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'You', text: input };
    setMessages([...messages, userMsg]);
    setInput('');
    const { data } = await axios.post('/chatbot', { message: input });
    const botMsg = { sender: 'Robyn', text: data.reply };
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header" onClick={() => setOpen(!open)}>
        Robyn 🤖 {open ? '▼' : '▲'}
      </div>
      {open && (
        <div className="chatbot-body">
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i}><strong>{m.sender}:</strong> {m.text}</div>
            ))}
          </div>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
                         }
