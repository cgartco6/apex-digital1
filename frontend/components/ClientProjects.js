import { useState } from 'react';
import styles from './ClientProjects.module.css'; // you can create a separate module or reuse global

export default function ClientProjects({ projects }) {
  const [expanded, setExpanded] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ai_processing': return '#3B82F6';
      case 'proof_check': return '#F59E0B';
      case 'delivered': return '#10B981';
      case 'completed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <section className={styles.projects}>
      <h2>Your Projects</h2>
      {projects.length === 0 ? (
        <p>You have no projects yet. <a href="/services">Start one now!</a></p>
      ) : (
        <div className={styles.projectList}>
          {projects.map(project => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectHeader} onClick={() => setExpanded(expanded === project.id ? null : project.id)}>
                <div>
                  <h3>{project.type} – {project.package}</h3>
                  <p className={styles.status} style={{ backgroundColor: getStatusColor(project.status) }}>
                    {project.status.replace('_', ' ')}
                  </p>
                </div>
                <span className={styles.toggle}>{expanded === project.id ? '▲' : '▼'}</span>
              </div>
              {expanded === project.id && (
                <div className={styles.projectDetails}>
                  <p><strong>Style:</strong> {project.style || 'N/A'}</p>
                  <p><strong>Requirements:</strong> {project.requirements}</p>
                  <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${project.progress}%` }} />
                    <span>{project.progress}% complete</span>
                  </div>
                  {project.files && (
                    <div className={styles.files}>
                      <strong>Files:</strong>
                      <ul>
                        {Object.entries(project.files).map(([key, url]) => (
                          <li key={key}><a href={url} target="_blank" rel="noreferrer">{key}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
