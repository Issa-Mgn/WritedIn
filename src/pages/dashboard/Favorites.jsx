import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import DashboardIcon from '../../components/DashboardIcon';
import { useAuth } from '../../context/AuthContext';
import { addUserFavorite, deleteUserFavorite, subscribeUserFavorites } from '../../services/userData';

const favoriteStarters = [
  {
    title: 'Le post confession',
    type: 'Authenticité',
    icon: 'heart',
    preview: 'Partir d’un doute ou d’une difficulté pour créer un post humain et mémorable.',
  },
  {
    title: 'La checklist utile',
    type: 'Expertise',
    icon: 'grid',
    preview: 'Transformer votre méthode en étapes simples que votre audience peut appliquer.',
  },
  {
    title: 'La prise de position',
    type: 'Opinion',
    icon: 'idea',
    preview: 'Défendre un point de vue clair avec nuance, preuves et conclusion forte.',
  },
];

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [savingTitle, setSavingTitle] = useState('');

  useEffect(() => {
    if (!user) return undefined;
    return subscribeUserFavorites(user.uid, setFavorites);
  }, [user]);

  const savedTitles = useMemo(
    () => new Set(favorites.map(favorite => favorite.title)),
    [favorites]
  );

  const buildTemplate = (starter) => ({
    ...starter,
    prompt: `${starter.title}\n\nAngle choisi : ${starter.preview}\n\nIdée à développer : `,
  });

  const openStarter = (starter) => {
    navigate('/studio', {
      state: {
        template: buildTemplate(starter),
      },
    });
  };

  const saveFavorite = async (starter) => {
    if (!user || savedTitles.has(starter.title)) return;

    setSavingTitle(starter.title);
    try {
      await addUserFavorite(user.uid, starter);
    } finally {
      setSavingTitle('');
    }
  };

  return (
    <Layout>
      <div className="favorites-page">
        <section className="dashboard-page-hero">
          <div>
            <span className="section-kicker">Favoris</span>
            <h1>Votre bibliothèque d’angles</h1>
            <p>Vos trames favorites sont sauvegardées dans Firebase et vous suivent sur tous vos appareils.</p>
          </div>
          <DashboardIcon name="heart" size={34} color="#e11d48" />
        </section>

        <div className="favorites-layout">
          <section className="favorite-starters">
            <div className="favorite-section-header">
              <span className="section-kicker">Mes favoris</span>
              <h2>Trames sauvegardées</h2>
            </div>

            {favorites.length === 0 ? (
              <div className="empty-dashboard-state favorites-empty">
                <DashboardIcon name="heart" size={42} color="#e11d48" />
                <h2>Aucun favori enregistré</h2>
                <p>Ajoutez une trame depuis les suggestions. Elle sera disponible à chaque connexion.</p>
              </div>
            ) : (
              <div className="favorite-grid">
                {favorites.map(favorite => (
                  <article className="favorite-card" key={favorite.id}>
                    <div className="favorite-card-icon">
                      <DashboardIcon name={favorite.icon || 'idea'} size={24} />
                    </div>
                    <span>{favorite.type}</span>
                    <h3>{favorite.title}</h3>
                    <p>{favorite.preview}</p>
                    <div className="favorite-card-actions">
                      <button type="button" onClick={() => openStarter(favorite)}>Utiliser</button>
                      <button type="button" className="danger" onClick={() => deleteUserFavorite(favorite.id)}>Retirer</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="favorite-starters">
            <div className="favorite-section-header">
              <span className="section-kicker">Suggestions</span>
              <h2>Trames à tester</h2>
            </div>

            <div className="favorite-grid">
              {favoriteStarters.map(starter => {
                const isSaved = savedTitles.has(starter.title);
                return (
                  <article className="favorite-card" key={starter.title}>
                    <div className="favorite-card-icon">
                      <DashboardIcon name={starter.icon} size={24} />
                    </div>
                    <span>{starter.type}</span>
                    <h3>{starter.title}</h3>
                    <p>{starter.preview}</p>
                    <div className="favorite-card-actions">
                      <button type="button" onClick={() => openStarter(starter)}>Utiliser</button>
                      <button type="button" disabled={isSaved || savingTitle === starter.title} onClick={() => saveFavorite(starter)}>
                        {isSaved ? 'Ajouté' : savingTitle === starter.title ? 'Ajout...' : 'Ajouter'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Favorites;
