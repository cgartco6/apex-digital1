import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from '../lib/api';
import ClientProjects from '../components/ClientProjects';
import styles from '../styles/Dashboard.module.css';

export default function ClientDashboard() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
    }
    if (user) {
      fetchProjects();
    }
  }, [user, loading]);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/dashboard/projects');
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <h1>Welcome, {user?.fullName}</h1>
      <ClientProjects projects={projects} />
    </Layout>
  );
  }
