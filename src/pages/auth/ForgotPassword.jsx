import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, LifeBuoy, Mail, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/img-png.png';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Nous n'avons pas trouvé de compte avec cette adresse email.");
    } finally {
      setLoading(false);
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
          <h2>Pas grave, on te remet sur les rails.</h2>
          <p>Entre ton email et on t’envoie un lien sécurisé pour choisir un nouveau mot de passe.</p>

          <div className="visual-features">
            <div className="feature-item">
              <div className="feature-icon"><LifeBuoy size={22} /></div>
              <div>
                <h4>Aide rapide</h4>
                <p>Le lien arrive directement dans ta boîte mail.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><CheckCircle size={22} /></div>
              <div>
                <h4>Compte conservé</h4>
                <p>Tes trames, ton historique et tes réglages restent en place.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="auth-form-side">
        <Link to="/auth/login" className="back-link">
          <ArrowLeft size={18} />
          Connexion
        </Link>

        <div className="auth-container">
          <div className="auth-mobile-brand">
            <img src={logo} alt="WritedIn" />
            <span>WritedIn</span>
          </div>

          <div className="auth-card">
            <div className="auth-header">
              <span className="auth-kicker">Mot de passe oublié</span>
              <h1>Réinitialiser.</h1>
              <p>Indique l’email de ton compte WritedIn. On t’envoie le lien de récupération.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            {!submitted ? (
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

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <div className="loading-spinner" /> : <><Send size={20} /> Envoyer le lien</>}
                </button>
              </form>
            ) : (
              <div className="auth-success">
                <CheckCircle size={56} />
                <h2>Email envoyé</h2>
                <p>
                  Un lien de réinitialisation vient d’être envoyé à <strong>{email}</strong>.
                  Vérifie aussi tes spams si tu ne le vois pas.
                </p>
                <button className="social-btn" type="button" onClick={() => setSubmitted(false)}>
                  Utiliser un autre email
                </button>
              </div>
            )}

            <div className="auth-footer">
              <Link to="/auth/login">Je m’en rappelle finalement</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
