import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from '../lib/api';
import { useTranslation } from 'react-i18next';
import { FiLink, FiUnlink, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import styles from '../styles/SocialAccounts.module.css';

export default function SocialAccounts() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
    { id: 'linkedin', name: 'LinkedIn', icon: '🔗', color: '#0A66C2' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' }
  ];

  useEffect(() => {
    if (user) fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/social-accounts');
      setAccounts(data);
    } catch (err) {
      toast.error(t('fetch_failed'));
    } finally {
      setLoading(false);
    }
  };

  const connectAccount = async (platform) => {
    setConnecting(platform);
    try {
      const { data } = await axios.get(`/oauth/${platform}`);
      // Redirect to OAuth provider
      window.location.href = data.url;
    } catch (err) {
      toast.error(t('connect_failed'));
      setConnecting(null);
    }
  };

  const disconnectAccount = async (id) => {
    if (!confirm(t('confirm_disconnect'))) return;
    try {
      await axios.delete(`/social-accounts/${id}`);
      toast.success(t('disconnected'));
      fetchAccounts();
    } catch (err) {
      toast.error(t('disconnect_failed'));
    }
  };

  const refreshToken = async (id) => {
    try {
      await axios.post(`/social-accounts/${id}/refresh`);
      toast.success(t('token_refreshed'));
    } catch (err) {
      toast.error(t('refresh_failed'));
    }
  };

  if (loading) return <Layout><div className={styles.loading}>{t('loading')}</div></Layout>;

  return (
    <Layout>
      <h1>{t('social_accounts')}</h1>
      <p className={styles.subtitle}>{t('connect_accounts_desc')}</p>

      <div className={styles.grid}>
        {platforms.map(platform => {
          const connectedAccounts = accounts.filter(a => a.platform === platform.id);
          const isConnecting = connecting === platform.id;

          return (
            <div key={platform.id} className={styles.card} style={{ borderTopColor: platform.color }}>
              <div className={styles.cardHeader}>
                <span className={styles.icon}>{platform.icon}</span>
                <h2>{platform.name}</h2>
              </div>

              {connectedAccounts.length === 0 ? (
                <button
                  className={styles.connectBtn}
                  onClick={() => connectAccount(platform.id)}
                  disabled={isConnecting}
                >
                  {isConnecting ? t('connecting') : t('connect')}
                  <FiLink />
                </button>
              ) : (
                <div className={styles.accountList}>
                  {connectedAccounts.map(acc => (
                    <div key={acc.id} className={styles.accountItem}>
                      <div className={styles.accountInfo}>
                        <span className={styles.accountName}>{acc.accountName}</span>
                        <span className={styles.accountId}>@{acc.pageId || acc.username}</span>
                      </div>
                      <div className={styles.accountActions}>
                        <button onClick={() => refreshToken(acc.id)} title={t('refresh_token')}>
                          <FiRefreshCw />
                        </button>
                        <button onClick={() => disconnectAccount(acc.id)} title={t('disconnect')}>
                          <FiUnlink />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className={styles.connectAnother}
                    onClick={() => connectAccount(platform.id)}
                    disabled={isConnecting}
                  >
                    {t('connect_another')}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {accounts.length > 0 && (
        <div className={styles.stats}>
          <h3>{t('connected_summary')}</h3>
          <p>{t('total_connected', { count: accounts.length })}</p>
        </div>
      )}
    </Layout>
  );
     }
