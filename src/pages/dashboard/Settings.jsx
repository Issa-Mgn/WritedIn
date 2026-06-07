import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Mail } from 'lucide-react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import DashboardIcon from '../../components/DashboardIcon';
import { syncUserToResend } from '../../services/api';
import { ensureUserProfile, getUserSettings, saveUserSettings } from '../../services/userData';

const defaultWritingPreferences = {
  defaultEmojis: true,
  defaultConversational: true,
  defaultHashtags: true,
  defaultHooks: true,
  defaultProfessional: true,
  autosaveDrafts: true,
};

const Toggle = ({ checked, label, description, icon, onChange }) => (
  <button
    type="button"
    className={`settings-toggle ${checked ? 'active' : ''}`}
    onClick={onChange}
    role="switch"
    aria-checked={checked}
  >
    <span className="settings-toggle-icon">
      <DashboardIcon name={icon} size={20} />
    </span>
    <span>
      <strong>{label}</strong>
      <small>{description}</small>
    </span>
    <span className="toggle-control" />
  </button>
);

const Settings = () => {
  const { user, resetPassword, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState(defaultWritingPreferences);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const passwordProviderEnabled = user?.providerData?.some(provider => provider.providerId === 'password');

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const loadSettings = async () => {
      try {
        await ensureUserProfile(user);
        const savedSettings = await getUserSettings(user.uid);

        if (!cancelled && savedSettings?.preferences) {
          setPreferences(prev => ({ ...prev, ...savedSettings.preferences }));
        }

        if (!cancelled && typeof savedSettings?.marketingEmails === 'boolean') {
          setMarketingEmails(savedSettings.marketingEmails);
        }
      } catch (err) {
        setStatus(`Firestore refuse les paramètres : ${err?.code || err?.message || 'erreur inconnue'}`);
      }
    };

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const savePreferences = async (nextPreferences) => {
    if (!user) return;

    try {
      await saveUserSettings(user.uid, { preferences: nextPreferences });
      setStatus('Paramètres sauvegardés.');
    } catch (err) {
      setStatus(`Impossible de sauvegarder : ${err?.code || err?.message || 'erreur Firestore'}`);
    }
  };

  const togglePreference = (key) => {
    setPreferences(prev => {
      const nextPreferences = { ...prev, [key]: !prev[key] };
      savePreferences(nextPreferences);
      return nextPreferences;
    });
  };

  const toggleMarketingEmails = async () => {
    if (!user) return;

    const nextMarketingEmails = !marketingEmails;
    setMarketingEmails(nextMarketingEmails);
    setStatus('');

    try {
      await saveUserSettings(user.uid, { marketingEmails: nextMarketingEmails });
      await syncUserToResend(user, { marketingOptIn: nextMarketingEmails });
      setStatus(
        nextMarketingEmails
          ? 'Emails hebdomadaires activés.'
          : 'Emails hebdomadaires désactivés.'
      );
    } catch (err) {
      setMarketingEmails(!nextMarketingEmails);
      setStatus(`Impossible de mettre à jour les emails : ${err?.message || 'erreur inconnue'}`);
    }
  };

  const sendResetEmail = async () => {
    if (!user?.email) return;
    if (!passwordProviderEnabled) {
      setStatus('Ce compte est connecté avec Google. Le mot de passe se gère depuis votre compte Google.');
      return;
    }

    setSaving(true);
    setStatus('');

    try {
      await resetPassword(user.email);
      setStatus(`Email de réinitialisation envoyé à ${user.email}. Vérifiez aussi les spams.`);
    } catch (err) {
      const messageByCode = {
        'auth/operation-not-allowed': "La connexion Email/Mot de passe n'est pas activée dans Firebase Authentication.",
        'auth/too-many-requests': 'Trop de demandes. Réessayez dans quelques minutes.',
        'auth/network-request-failed': 'Problème réseau. Vérifiez la connexion puis réessayez.',
        'auth/user-not-found': "Aucun compte Email/Mot de passe n'est lié à cette adresse.",
      };

      setStatus(messageByCode[err?.code] || `Impossible d'envoyer l'email : ${err?.code || err?.message || 'erreur inconnue'}`);
      console.warn(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <Layout>
      <div className="settings-page">
        <section className="dashboard-page-hero">
          <div>
            <span className="section-kicker">Paramètres</span>
            <h1>Vos préférences WritedIn</h1>
            <p>Définissez le comportement par défaut du Studio et gardez les actions du compte à portée de main.</p>
          </div>
          <DashboardIcon name="settings" size={34} color="#0A66C2" />
        </section>

        <div className="settings-layout">
          <section className="settings-panel">
            <div className="studio-box-header">
              <div>
                <span className="section-kicker">Studio</span>
                <h2>Réglages par défaut</h2>
              </div>
              <DashboardIcon name="studio" size={24} color="#0A66C2" />
            </div>

            <div className="settings-toggle-list">
              <Toggle
                checked={preferences.defaultEmojis}
                icon="heart"
                label="Emojis"
                description="Autoriser les emojis dans les générations par défaut."
                onChange={() => togglePreference('defaultEmojis')}
              />
              <Toggle
                checked={preferences.defaultConversational}
                icon="idea"
                label="Ton conversationnel"
                description="Démarrer le Studio avec une voix plus directe et naturelle."
                onChange={() => togglePreference('defaultConversational')}
              />
              <Toggle
                checked={preferences.defaultHashtags}
                icon="grid"
                label="Hashtags"
                description="Ajouter les hashtags dans les générations par défaut."
                onChange={() => togglePreference('defaultHashtags')}
              />
              <Toggle
                checked={preferences.defaultHooks}
                icon="favorites"
                label="Accroche forte"
                description="Favoriser une première phrase plus marquante."
                onChange={() => togglePreference('defaultHooks')}
              />
              <Toggle
                checked={preferences.defaultProfessional}
                icon="layers"
                label="Expertise pro"
                description="Garder un rendu structuré, crédible et orienté LinkedIn."
                onChange={() => togglePreference('defaultProfessional')}
              />
              <Toggle
                checked={preferences.autosaveDrafts}
                icon="reload"
                label="Brouillons automatiques"
                description="Sauvegarder votre brief pendant que vous écrivez."
                onChange={() => togglePreference('autosaveDrafts')}
              />
            </div>
          </section>

          <aside className="settings-side">
            <section className="settings-panel">
              <div className="studio-box-header">
                <div>
                  <span className="section-kicker">Compte</span>
                  <h2>Connexion</h2>
                </div>
                <DashboardIcon name="user" size={24} color="#0A66C2" />
              </div>

              <div className="account-detail-list">
                <div className="account-detail">
                  <DashboardIcon name="user" size={20} />
                  <div>
                    <span>Email</span>
                    <strong>{user?.email || 'Non renseigné'}</strong>
                  </div>
                </div>
                <div className="account-detail">
                  <DashboardIcon name="info" size={20} />
                  <div>
                    <span>Vérification</span>
                    <strong className={user?.emailVerified ? 'positive' : ''}>
                      {user?.emailVerified ? 'Email vérifié' : 'Email non vérifié'}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="settings-panel company-contact-panel">
              <div className="studio-box-header">
                <div>
                  <span className="section-kicker">Support</span>
                  <h2>Contactez l'entreprise</h2>
                </div>
                <DashboardIcon name="info" size={24} color="#0A66C2" />
              </div>

              <div className="company-contact-actions">
                <a
                  href="mailto:miganissa334@gmail.com?subject=Contact%20WritedIn"
                  aria-label="Contacter WritedIn par email"
                >
                  <Mail size={20} aria-hidden="true" />
                  <span>Email</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/issa-migan-520051362"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Voir le profil LinkedIn WritedIn"
                >
                  <ExternalLink size={20} aria-hidden="true" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </section>

            <section className="settings-panel">
              <div className="studio-box-header">
                <div>
                  <span className="section-kicker">Emails</span>
                  <h2>Conseils hebdomadaires</h2>
                </div>
                <DashboardIcon name="info" size={24} color="#0A66C2" />
              </div>

              <div className="settings-toggle-list">
                <Toggle
                  checked={marketingEmails}
                  icon="idea"
                  label="Recevoir les rappels WritedIn"
                  description="Un email par semaine avec conseils LinkedIn, exemples de posts et lien de désinscription."
                  onChange={toggleMarketingEmails}
                />
              </div>
            </section>

            <section className="settings-panel security-panel">
              <div className="studio-box-header">
                <div>
                  <span className="section-kicker">Sécurité</span>
                  <h2>Actions</h2>
                </div>
                <DashboardIcon name="info" size={24} color="#0A66C2" />
              </div>

              <div className="security-actions">
                <button type="button" onClick={sendResetEmail} disabled={saving || !user?.email}>
                  {saving ? 'Envoi...' : 'Réinitialiser le mot de passe'}
                </button>
                <button type="button" className="danger" onClick={handleLogout}>
                  Déconnexion
                </button>
              </div>

              {status && <p className="settings-status">{status}</p>}
            </section>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
