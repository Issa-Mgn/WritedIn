import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0 });

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "posts"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStats({ total: snapshot.size });
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Mon Progrès</h1>
      </div>

      <div className="content-body">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Pages écrites</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.total * 45}</div>
            <div className="stat-label">Mots générés</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.total > 0 ? 'Régulier' : 'Débutant'}</div>
            <div className="stat-label">Statut</div>
          </div>
        </div>

        <section className="content-section">
          <div className="section-label">Évolution</div>
          <div style={{ padding: '40px', textAlign: 'center', background: '#f9fafb', borderRadius: '20px', color: '#6b7280' }}>
            Continue à écrire pour voir ton graphique d'évolution apparaître ici.
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Analytics;
