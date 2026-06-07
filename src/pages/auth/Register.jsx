import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Globe, Lock, Mail, Rocket, User, UserPlus, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { syncUserToResend } from '../../services/api';
import { saveUserSettings } from '../../services/userData';
import logo from '../../assets/img-png.png';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Le mot de passe doit contenir au moins 6 caractères.');
    }

    if (password !== confirmPassword) {
      return setError('Les deux mots de passe ne correspondent pas.');
    }

    setLoading(true);
    try {
      const userCredential = await signup(email, password, name);

      await saveUserSettings(userCredential.user.uid, {
        marketingEmails: marketingOptIn,
      });

      if (marketingOptIn) {
        await syncUserToResend(userCredential.user, { marketingOptIn: true });
      }

      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé par un autre compte.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("La connexion email/mot de passe n'est pas activée dans Firebase.");
      } else {
        setError("Une erreur est survenue lors de l'inscription.");
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
          <h2>Construis une présence LinkedIn plus claire, post après post.</h2>
          <p>Crée ton compte et accède au Studio, aux trames éditoriales et à ton historique de génération.</p>

          <div className="auth-metrics">
            <div><strong>1</strong><span>idée suffit</span></div>
            <div><strong>4</strong><span>réglages de voix</span></div>
            <div><strong>∞</strong><span>brouillons possibles</span></div>
          </div>

          <div className="visual-features">
            <div className="feature-item">
              <div className="feature-icon"><Rocket size={22} /></div>
              <div>
                <h4>Démarrage rapide</h4>
                <p>Écris ton premier post sans repartir d’une page blanche.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Globe size={22} /></div>
              <div>
                <h4>Angles plus nets</h4>
                <p>Choisis une structure avant de générer ton texte.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Users size={22} /></div>
              <div>
                <h4>Voix personnelle</h4>
                <p>Garde un ton humain, utile et reconnaissable.</p>
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
              <span className="auth-kicker">Inscription</span>
              <h1>Créer ton compte.</h1>
              <p>Quelques informations et ton espace WritedIn sera prêt.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nom</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={19} />
                  <input
                    type="text"
                    id="name"
                    className="auth-input"
                    placeholder="Jean Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

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
                <label htmlFor="password">Mot de passe</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={19} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="auth-input has-action"
                    placeholder="6 caractères minimum"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
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

              <div className="form-group">
                <label htmlFor="confirm-password">Confirmer le mot de passe</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={19} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirm-password"
                    className="auth-input has-action"
                    placeholder="Répète ton mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    aria-label={showConfirmPassword ? 'Masquer la confirmation' : 'Afficher la confirmation'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <label className="auth-consent">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(event) => setMarketingOptIn(event.target.checked)}
                />
                <span>
                  Recevoir chaque semaine un conseil LinkedIn et des idées de posts WritedIn. Désinscription possible à tout moment.
                </span>
              </label>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <div className="loading-spinner" /> : <><UserPlus size={20} /> Créer mon compte</>}
              </button>
            </form>

            <div className="divider">ou s'inscrire avec</div>

            <button className="social-btn" onClick={handleGoogleLogin} type="button" disabled={googleLoading}>
              {googleLoading ? (
                <div className="loading-spinner social-spinner" />
              ) : (
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              )}
              {googleLoading ? 'Connexion...' : 'Google'}
            </button>

            <div className="auth-footer">
              Déjà un compte ? <Link to="/auth/login">Se connecter</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
