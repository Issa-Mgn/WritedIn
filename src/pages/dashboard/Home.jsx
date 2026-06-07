import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Search } from 'lucide-react';
import Layout from '../../components/Layout';
import DashboardIcon from '../../components/DashboardIcon';
import { useAuth } from '../../context/AuthContext';
import { addUserFavorite, deleteUserFavorite, subscribeUserFavorites } from '../../services/userData';

const categories = ['Tous', 'Storytelling', 'Opinion', 'Expertise', 'Authenticité', 'Carrière', 'Business', 'Leadership'];

const structures = [
  { id: 1, title: 'Le parcours initiatique', type: 'Storytelling', icon: 'layers', preview: "Raconter une transition professionnelle ou la genèse d'un projet avec une vraie progression." },
  { id: 2, title: 'Le contre-pied', type: 'Opinion', icon: 'idea', preview: 'Prendre une idée reçue de votre industrie et montrer pourquoi elle mérite nuance.' },
  { id: 3, title: 'La méthode pas-à-pas', type: 'Expertise', icon: 'grid', preview: 'Partager un process précis, clair et directement applicable.' },
  { id: 4, title: "L'envers du décor", type: 'Authenticité', icon: 'eye', preview: 'Montrer la réalité derrière un résultat: doutes, contraintes, arbitrages et apprentissages.' },
  { id: 5, title: "L'erreur classique", type: 'Opinion', icon: 'info', preview: "Expliquer l'erreur que beaucoup font dans votre domaine et comment l'éviter." },
  { id: 6, title: 'Le bilan de la semaine', type: 'Authenticité', icon: 'reload', preview: 'Faire un récapitulatif transparent de vos avancées, blocages et leçons.' },
  { id: 7, title: "L'analyse de tendance", type: 'Expertise', icon: 'eye', preview: 'Décrypter une tendance de votre secteur avec un point de vue utile.' },
  { id: 8, title: 'La ressource inattendue', type: 'Expertise', icon: 'favorites', preview: 'Partager un outil, une astuce ou une ressource qui vous a vraiment aidé.' },
  { id: 9, title: 'Le mythe débunké', type: 'Opinion', icon: 'info', preview: 'Démonter une croyance populaire avec des exemples et une conclusion claire.' },
  { id: 10, title: 'La leçon du mentor', type: 'Storytelling', icon: 'studio', preview: 'Transformer un conseil reçu en post utile pour votre audience.' },
  { id: 11, title: 'Le déclic professionnel', type: 'Carrière', icon: 'idea', preview: 'Raconter le moment où votre façon de travailler a changé.' },
  { id: 12, title: 'Avant / Après', type: 'Storytelling', icon: 'reload', preview: 'Comparer votre ancienne approche et votre nouvelle manière de faire.' },
  { id: 13, title: 'La checklist utile', type: 'Expertise', icon: 'grid', preview: 'Transformer une méthode en liste claire que votre audience peut appliquer.' },
  { id: 14, title: 'Le framework personnel', type: 'Expertise', icon: 'layers', preview: 'Présenter votre propre grille de lecture en 3 à 5 points.' },
  { id: 15, title: 'La prise de position', type: 'Opinion', icon: 'idea', preview: 'Défendre un point de vue net, argumenté et professionnel.' },
  { id: 16, title: 'Le post confession', type: 'Authenticité', icon: 'heart', preview: 'Partir d’un doute ou d’une difficulté pour créer un post humain et mémorable.' },
  { id: 17, title: 'La décision difficile', type: 'Leadership', icon: 'settings', preview: 'Expliquer un choix compliqué, les critères utilisés et ce que vous en retenez.' },
  { id: 18, title: 'Le retour d’expérience', type: 'Expertise', icon: 'studio', preview: 'Partager ce que vous avez appris après un projet, un lancement ou une mission.' },
  { id: 19, title: 'Le client idéal', type: 'Business', icon: 'user', preview: 'Clarifier à qui vous servez le mieux et pourquoi.' },
  { id: 20, title: 'Le problème invisible', type: 'Business', icon: 'eye', preview: 'Mettre en lumière un problème que votre audience sous-estime.' },
  { id: 21, title: 'La mini étude de cas', type: 'Business', icon: 'layers', preview: 'Raconter un cas concret: contexte, action, résultat, leçon.' },
  { id: 22, title: 'La promesse réaliste', type: 'Business', icon: 'info', preview: 'Présenter une offre ou une compétence sans survente ni discours creux.' },
  { id: 23, title: 'Le conseil que personne ne veut entendre', type: 'Opinion', icon: 'info', preview: 'Formuler une vérité inconfortable avec tact et crédibilité.' },
  { id: 24, title: 'Le top 5 terrain', type: 'Expertise', icon: 'grid', preview: 'Lister cinq apprentissages tirés de votre pratique réelle.' },
  { id: 25, title: 'La compétence sous-cotée', type: 'Carrière', icon: 'favorites', preview: 'Mettre en avant une compétence discrète mais décisive.' },
  { id: 26, title: 'Le premier pas', type: 'Carrière', icon: 'studio', preview: 'Aider un débutant à démarrer sans se perdre dans la théorie.' },
  { id: 27, title: 'La reconversion assumée', type: 'Carrière', icon: 'reload', preview: 'Raconter un changement de voie avec lucidité et progression.' },
  { id: 28, title: 'Le message aux débutants', type: 'Carrière', icon: 'heart', preview: 'Donner un conseil bienveillant à ceux qui commencent dans votre domaine.' },
  { id: 29, title: 'Le principe de travail', type: 'Leadership', icon: 'layers', preview: 'Partager une règle qui guide vos décisions au quotidien.' },
  { id: 30, title: 'Le désaccord constructif', type: 'Leadership', icon: 'idea', preview: 'Exprimer un désaccord sans agressivité et avec des arguments solides.' },
  { id: 31, title: 'Ce que je ne fais plus', type: 'Authenticité', icon: 'eye', preview: 'Montrer une pratique abandonnée et expliquer ce qui a changé.' },
  { id: 32, title: 'Le post gratitude', type: 'Authenticité', icon: 'heart', preview: 'Remercier une personne, une équipe ou une expérience sans tomber dans le cliché.' },
  { id: 33, title: 'La question ouverte', type: 'Opinion', icon: 'info', preview: 'Lancer une discussion intelligente autour d’un sujet de votre secteur.' },
  { id: 34, title: 'Le comparatif simple', type: 'Expertise', icon: 'grid', preview: 'Comparer deux approches pour aider votre audience à choisir.' },
  { id: 35, title: 'La coulisse d’un résultat', type: 'Storytelling', icon: 'eye', preview: 'Expliquer ce qu’il a fallu faire pour obtenir un résultat visible.' },
  { id: 36, title: 'La leçon d’échec', type: 'Storytelling', icon: 'reload', preview: 'Transformer un échec en apprentissage utile et crédible.' },
];

const buildTemplate = (structure) => ({
  title: structure.title,
  type: structure.type,
  preview: structure.preview,
  icon: structure.icon,
  prompt: `${structure.title}\n\nAngle choisi : ${structure.preview}\n\nIdée à développer : `,
});

const Home = () => {
  const [search, setSearch] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [portalNode, setPortalNode] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [savingTitle, setSavingTitle] = useState('');
  const [favoriteError, setFavoriteError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchInputRef = useRef(null);

  useEffect(() => {
    setPortalNode(document.getElementById('header-search-portal'));
  }, []);

  useEffect(() => {
    if (!mobileSearchOpen) return undefined;

    const timeout = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 180);

    return () => clearTimeout(timeout);
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (!user) return undefined;

    setFavoriteError('');
    return subscribeUserFavorites(user.uid, setFavorites, (error) => {
      setFavoriteError(error?.code || error?.message || 'Erreur Firestore');
    });
  }, [user]);

  const favoritesByTitle = useMemo(() => {
    return new Map(favorites.map(favorite => [favorite.title, favorite]));
  }, [favorites]);

  const filteredStructures = structures.filter(structure => {
    const query = search.toLowerCase();
    const matchesSearch = structure.title.toLowerCase().includes(query) || structure.type.toLowerCase().includes(query);
    const matchesCategory = activeCategory === 'Tous' || structure.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const openStructure = (structure) => {
    navigate('/studio', {
      state: {
        template: buildTemplate(structure),
      },
    });
  };

  const toggleFavorite = async (event, structure) => {
    event.stopPropagation();
    if (!user || savingTitle) return;

    const existingFavorite = favoritesByTitle.get(structure.title);
    setSavingTitle(structure.title);
    setFavoriteError('');

    try {
      if (existingFavorite) {
        await deleteUserFavorite(existingFavorite.id);
      } else {
        await addUserFavorite(user.uid, {
          title: structure.title,
          type: structure.type,
          icon: structure.icon,
          preview: structure.preview,
        });
      }
    } catch (error) {
      console.warn('Favorite not saved:', error);
      setFavoriteError(error?.code || error?.message || 'Erreur Firestore');
    } finally {
      setSavingTitle('');
    }
  };

  const searchInputContent = (
    <div className={`home-search-shell ${mobileSearchOpen || search ? 'expanded' : ''}`}>
      <button
        type="button"
        className="home-search-toggle"
        aria-label="Ouvrir la recherche"
        onClick={() => setMobileSearchOpen(true)}
      >
        <Search size={19} />
      </button>
      <div className="editorial-search home-header-search" style={{ padding: '8px 15px' }}>
        <Search className="home-search-static-icon" size={18} color="#94a3b8" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Rechercher une trame, un angle..."
          value={search}
          onFocus={() => setMobileSearchOpen(true)}
          onBlur={(e) => {
            if (!e.target.value.trim()) setMobileSearchOpen(false);
          }}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="editorial-header" style={{ marginBottom: '30px' }}>
        <h1 className="editorial-title">Trouvez votre angle.</h1>
        <p className="editorial-subtitle" style={{ marginBottom: '20px' }}>
          Des trames narratives éprouvées par les créateurs pour structurer vos pensées.
        </p>
      </div>

      {portalNode && createPortal(searchInputContent, portalNode)}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: activeCategory === cat ? 'var(--primary)' : '#e2e8f0',
              background: activeCategory === cat ? 'var(--primary)' : 'white',
              color: activeCategory === cat ? 'white' : '#64748b',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {favoriteError && (
        <div className="history-sync-warning">
          Impossible de synchroniser les favoris avec Firestore : {favoriteError}.
        </div>
      )}

      <div className="editorial-grid">
        {filteredStructures.map(structure => {
          const isFavorite = favoritesByTitle.has(structure.title);
          const isSaving = savingTitle === structure.title;

          return (
            <div key={structure.id} className="editorial-card" onClick={() => openStructure(structure)}>
              <div className="editorial-card-header" style={{ marginBottom: '15px' }}>
                <span className="editorial-type" style={{ fontSize: '0.7rem' }}>{structure.type}</span>
                <button
                  type="button"
                  className={`editorial-favorite-btn ${isFavorite ? 'active' : ''}`}
                  onClick={(event) => toggleFavorite(event, structure)}
                  disabled={isSaving}
                  title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="editorial-icon" style={{ opacity: 0.72, marginBottom: '14px' }}>
                <DashboardIcon name={structure.icon} size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{structure.title}</h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '15px' }}>{structure.preview}</p>
              <div className="editorial-action" style={{ fontSize: '0.8rem' }}>
                <span>Utiliser la trame</span>
                <ChevronRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default Home;
