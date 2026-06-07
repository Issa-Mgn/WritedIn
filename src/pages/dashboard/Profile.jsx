import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import DashboardIcon from '../../components/DashboardIcon';
import { ensureUserProfile, subscribeUserFavorites, subscribeUserPosts } from '../../services/userData';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
    if (!user) return undefined;

    ensureUserProfile(user).catch(err => setSyncError(err?.code || err?.message || 'Erreur Firestore'));
    const unsubscribePosts = subscribeUserPosts(user.uid, setPosts, err => setSyncError(err?.code || err?.message || 'Erreur Firestore'));
    const unsubscribeFavorites = subscribeUserFavorites(user.uid, setFavorites, err => setSyncError(err?.code || err?.message || 'Erreur Firestore'));

    return () => {
      unsubscribePosts?.();
      unsubscribeFavorites?.();
    };
  }, [user]);

  const profileName = user?.displayName || 'Créateur WritedIn';
  const email = user?.email || 'email non renseigné';
  const initial = (profileName?.[0] || email?.[0] || 'W').toUpperCase();
  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : 'Date inconnue';
  const lastLogin = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Récemment';

  const stats = useMemo(() => {
    const words = posts.reduce((total, post) => total + String(post.content || '').split(/\s+/).filter(Boolean).length, 0);
    return [
      { label: 'Posts générés', value: posts.length, icon: 'studio' },
      { label: 'Mots écrits', value: words, icon: 'grid' },
      { label: 'Trames favorites', value: favorites.length, icon: 'heart' },
    ];
  }, [favorites.length, posts]);

  const accountDetails = [
    { label: 'Email', value: email, icon: 'user' },
    { label: 'Email', value: user?.emailVerified ? 'Vérifié' : 'Non vérifié', icon: 'info', positive: user?.emailVerified },
    { label: 'Membre depuis', value: memberSince, icon: 'reload' },
    { label: 'Dernière connexion', value: lastLogin, icon: 'eye' },
  ];

  return (
    <Layout>
      <div className="account-page">
        <section className="dashboard-page-hero">
          <div>
            <span className="section-kicker">Mon compte</span>
            <h1>Votre espace personnel</h1>
            <p>Retrouvez vos informations, votre activité d’écriture et les raccourcis utiles de WritedIn.</p>
          </div>
          <DashboardIcon name="user" size={34} color="#0A66C2" />
        </section>

        {syncError && (
          <div className="history-sync-warning">
            Firestore ne répond pas correctement : {syncError}.
          </div>
        )}

        <div className="account-grid">
          <section className="account-hero-card">
            <div className="account-avatar">{initial}</div>
            <div className="account-identity">
              <span className="section-kicker">Profil</span>
              <h2>{profileName}</h2>
              <p>{email}</p>
              <div className="account-badges">
                <span>Compte Firebase</span>
                <span>{user?.emailVerified ? 'Email vérifié' : 'Email à vérifier'}</span>
              </div>
            </div>
          </section>

          <section className="account-panel account-quick-card">
            <div className="studio-box-header">
              <div>
                <span className="section-kicker">Raccourcis</span>
                <h2>Continuer</h2>
              </div>
              <DashboardIcon name="studio" size={24} color="#0A66C2" />
            </div>
            <div className="account-actions">
              <button type="button" onClick={() => navigate('/studio')}>
                Ouvrir le Studio
                <DashboardIcon name="studio" size={18} />
              </button>
              <button type="button" onClick={() => navigate('/history')}>
                Voir l’historique
                <DashboardIcon name="reload" size={18} />
              </button>
              <button type="button" onClick={() => navigate('/favorites')}>
                Trames favorites
                <DashboardIcon name="heart" size={18} />
              </button>
            </div>
          </section>
        </div>

        <div className="dashboard-stats">
          {stats.map(stat => (
            <div className="dashboard-stat" key={stat.label}>
              <DashboardIcon name={stat.icon} size={22} />
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>

        <div className="account-sections">
          <section className="account-panel">
            <div className="studio-box-header">
              <div>
                <span className="section-kicker">Informations</span>
                <h2>Détails du compte</h2>
              </div>
              <DashboardIcon name="info" size={24} color="#0A66C2" />
            </div>

            <div className="account-detail-list">
              {accountDetails.map(detail => (
                <div className="account-detail" key={`${detail.label}-${detail.value}`}>
                  <DashboardIcon name={detail.icon} size={20} />
                  <div>
                    <span>{detail.label}</span>
                    <strong className={detail.positive ? 'positive' : ''}>{detail.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="account-panel">
            <div className="studio-box-header">
              <div>
                <span className="section-kicker">Paramètres</span>
                <h2>Préférences</h2>
              </div>
              <DashboardIcon name="settings" size={24} color="#0A66C2" />
            </div>

            <p className="account-panel-copy">
              Réglez les préférences par défaut du Studio: hashtags, accroche, ton conversationnel, expertise pro et brouillons.
            </p>
            <button className="btn-create-post" type="button" onClick={() => navigate('/settings')}>
              Modifier les paramètres <DashboardIcon name="settings" size={18} />
            </button>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
