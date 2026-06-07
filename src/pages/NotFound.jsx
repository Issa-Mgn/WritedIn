import { ArrowLeft, Home, PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import DashboardIcon from '../components/DashboardIcon';

const NotFoundContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="not-found-page">
      <div className="not-found-code">404</div>
      <span className="section-kicker">Page introuvable</span>
      <h1>Cette page n’existe pas ou a été déplacée.</h1>
      <p>
        Le lien que vous avez ouvert ne correspond à aucune page WritedIn.
        Vous pouvez revenir à un espace connu et reprendre votre écriture.
      </p>

      <div className="not-found-actions">
        <button type="button" className="btn-create-post" onClick={() => navigate(user ? '/' : '/')}>
          <Home size={18} /> Retour à l’accueil
        </button>
        {user ? (
          <button type="button" className="not-found-secondary" onClick={() => navigate('/studio')}>
            <PenLine size={18} /> Ouvrir le Studio
          </button>
        ) : (
          <button type="button" className="not-found-secondary" onClick={() => navigate('/auth/login')}>
            <ArrowLeft size={18} /> Se connecter
          </button>
        )}
      </div>
    </section>
  );
};

const NotFound = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <Layout>
        <NotFoundContent />
      </Layout>
    );
  }

  return (
    <main className="not-found-public">
      <div className="not-found-brand">
        <DashboardIcon name="studio" size={24} />
        <span>WritedIn</span>
      </div>
      <NotFoundContent />
    </main>
  );
};

export default NotFound;
