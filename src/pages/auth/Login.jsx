import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/img-png.png';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("La connexion email/mot de passe n'est pas activée dans Firebase.");
      } else {
        setError('Email ou mot de passe incorrect. Vérifie tes informations.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError("La connexion Google a échoué. Réessaie dans un instant.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-brand">
          <img src={logo} alt="WritedIn" className="auth-visual-logo" />
          <span>WritedIn</span>
        </div>

        <div className="visual-content">
          <h2>Transforme tes idées en posts qui donnent envie de répondre.</h2>
          <p>Retrouve tes trames, ton historique et ton espace d’écriture en quelques secondes.</p>

          <div className="auth-metrics">
            <div><strong>30s</strong><span>pour cadrer une idée</span></div>
            <div><strong>10+</strong><span>angles éditoriaux</span></div>
            <div><strong>24/7</strong><span>studio disponible</span></div>
          </div>

          <div className="visual-features">
            <div className="feature-item">
              <div className="feature-icon"><Sparkles size={22} /></div>
              <div>
                <h4>Posts structurés</h4>
                <p>Des accroches, des angles et des conclusions plus clairs.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Zap size={22} /></div>
              <div>
                <h4>Flux rapide</h4>
                <p>Passe de l’idée brute à une version publiable sans friction.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><ShieldCheck size={22} /></div>
              <div>
                <h4>Espace privé</h4>
                <p>Tes brouillons et tes générations restent liés à ton compte.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="auth-form-side">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          Accueil
        </Link>

        <div className="auth-container">
          <div className="auth-mobile-brand">
            <img src={logo} alt="WritedIn" />
            <span>WritedIn</span>
          </div>

          <div className="auth-card">
            <div className="auth-header">
              <span className="auth-kicker">Connexion</span>
              <h1>Bon retour.</h1>
              <p>Connecte-toi pour reprendre ton écriture là où tu l’avais laissée.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={19} />
                  <input
                    type="email"
                    id="email"
                    className="auth-input"
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="password">Mot de passe</label>
                  <Link to="/auth/forgot-password">Oublié ?</Link>
                </div>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={19} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="auth-input has-action"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <div className="loading-spinner" /> : <><LogIn size={20} /> Se connecter</>}
              </button>
            </form>

            <div className="divider">ou continuer avec</div>

            <button className="social-btn" onClick={handleGoogleLogin} type="button" disabled={googleLoading}>
              {googleLoading ? (
                <div className="loading-spinner social-spinner" />
              ) : (
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              )}
              {googleLoading ? 'Connexion...' : 'Google'}
            </button>

            <div className="auth-footer">
              Pas encore membre ? <Link to="/auth/register">Créer un compte</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
