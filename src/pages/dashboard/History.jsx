import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Copy, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import DashboardIcon from '../../components/DashboardIcon';
import { deleteUserPost, subscribeUserPosts } from '../../services/userData';

const History = () => {
  const [posts, setPosts] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return undefined;

    setSyncError(null);
    return subscribeUserPosts(user.uid, setPosts, setSyncError);
  }, [user]);

  const stats = useMemo(() => {
    const words = posts.reduce((total, post) => total + String(post.content || '').split(/\s+/).filter(Boolean).length, 0);
    return [
      { label: 'Posts générés', value: posts.length, icon: 'reload' },
      { label: 'Mots écrits', value: words, icon: 'grid' },
      { label: 'À reprendre', value: posts.filter(post => post.source === 'local').length, icon: 'idea' },
    ];
  }, [posts]);

  const formatDate = (value) => {
    const date = value?.toDate ? value.toDate() : new Date(value);

    if (Number.isNaN(date.getTime())) return 'Récemment';

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const copyPost = async (post) => {
    await navigator.clipboard.writeText(post.content || '');
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const reusePost = (post) => {
    navigate('/studio', {
      state: {
        template: {
          title: post.templateTitle || 'Post depuis l’historique',
          type: 'Historique',
          icon: 'reload',
          preview: 'Reprendre une ancienne génération comme base de travail.',
          prompt: post.prompt || post.content || '',
        },
      },
    });
  };

  const deletePost = async (id) => {
    if (window.confirm('Supprimer définitivement ce post ?')) {
      await deleteUserPost(id);
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const togglePost = (id) => {
    setExpandedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const canExpandPost = (content) => {
    const text = String(content || '');
    return text.length > 280 || text.split(/\r?\n/).length > 5;
  };

  return (
    <Layout>
      <div className="history-page">
        <section className="dashboard-page-hero">
          <div>
            <span className="section-kicker">Historique</span>
            <h1>Vos générations récentes</h1>
            <p>Retrouvez vos posts, copiez-les ou renvoyez-les dans le Studio pour les retravailler.</p>
          </div>
          <DashboardIcon name="reload" size={34} color="#0A66C2" />
        </section>

        <div className="dashboard-stats">
          {stats.map(stat => (
            <div className="dashboard-stat" key={stat.label}>
              <DashboardIcon name={stat.icon} size={22} />
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>

        {syncError && (
          <div className="history-sync-warning">
            Firestore refuse la lecture de l’historique : {syncError.code || syncError.message || 'erreur inconnue'}.
          </div>
        )}

        {posts.length === 0 ? (
          <div className="empty-dashboard-state">
            <DashboardIcon name="studio" size={42} color="#0A66C2" />
            <h2>Aucune génération pour le moment</h2>
            <p>Créez votre premier post dans le Studio, il apparaîtra ici automatiquement.</p>
            <button className="btn-create-post" onClick={() => navigate('/studio')}>
              Ouvrir WritedIn Studio <DashboardIcon name="studio" size={18} />
            </button>
          </div>
        ) : (
          <div className="history-list">
            {posts.map(post => (
              <article key={post.id} className={`history-card ${expandedPosts[post.id] ? 'expanded' : ''}`}>
                <div className="history-card-top">
                  <div>
                    <span>{post.templateTitle || 'Post généré'}</span>
                    <strong>{formatDate(post.createdAt)}</strong>
                  </div>
                  <div className="history-actions">
                    <button type="button" onClick={() => copyPost(post)} title="Copier">
                      <Copy size={17} /> {copiedId === post.id ? 'Copié' : 'Copier'}
                    </button>
                    <button type="button" onClick={() => reusePost(post)}>
                      Reprendre
                    </button>
                    <button type="button" className="danger" onClick={() => deletePost(post.id)} title="Supprimer">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
                <p>{post.content}</p>
                {canExpandPost(post.content) && (
                  <button
                    type="button"
                    className="history-expand-button"
                    onClick={() => togglePost(post.id)}
                    aria-expanded={Boolean(expandedPosts[post.id])}
                  >
                    <ChevronDown size={18} />
                    {expandedPosts[post.id] ? 'Voir moins' : 'Voir tout'}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;
