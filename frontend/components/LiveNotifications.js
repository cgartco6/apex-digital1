import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from '../styles/Notifications.module.css';

export default function LiveNotifications() {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL.replace('/api', ''), {
      auth: { token }
    });
    setSocket(socketInstance);

    socketInstance.on('notification', (data) => {
      setNotifications(prev => [data, ...prev].slice(0, 50));
      toast(data.message, { icon: '🔔' });
    });

    return () => socketInstance.disconnect();
  }, [user]);

  if (!user) return null;

  return (
    <div className={styles.notifications}>
      <h3>Live Updates</h3>
      <ul>
        {notifications.map((n, i) => (
          <li key={i}>{n.message}</li>
        ))}
      </ul>
    </div>
  );
                      }
