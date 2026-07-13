import { useState } from 'react';
import './IssaAdmin.css';

// Templates prédéfinis
const EMAIL_TEMPLATES = [
  {
    id: 'custom',
    name: '✏️ Message personnalisé',
    subject: '',
    message: '',
  },
  {
    id: 'new-features',
    name: '🚀 Nouvelles fonctionnalités',
    subject: '🚀 Nouvelles fonctionnalités WritedIn',
    message: `Salut 👋

On vient de déployer de nouvelles fonctionnalités sur WritedIn !

✨ Nouveautés :
• Génération 2x plus rapide avec notre nouveau modèle IA
• Interface repensée pour une meilleure expérience
• Nouveaux templates de posts LinkedIn

🎯 Astuce de la semaine :
Pour maximiser l'engagement, publie tes posts entre 8h-10h ou 17h-19h.

À très vite sur WritedIn !

Issa
Fondateur WritedIn`,
  },
  {
    id: 'weekly-tips',
    name: '💡 Conseils hebdomadaires',
    subject: '💡 Tes conseils WritedIn de la semaine',
    message: `Hey 👋

Voici tes conseils de la semaine pour créer des posts LinkedIn qui cartonnent :

📊 Statistiques WritedIn :
• Plus de 10,000 posts générés ce mois
• 1,500+ créateurs de contenu actifs
• 4.8/5 de satisfaction utilisateur

💡 Conseil #1 : Utilise des émojis (mais pas trop !)
Les posts avec 2-3 émojis ont 25% plus d'engagement.

💡 Conseil #2 : Pose une question
Les posts qui se terminent par une question obtiennent 3x plus de commentaires.

💡 Conseil #3 : Raconte une histoire
Les gens adorent les histoires personnelles et authentiques.

Prêt à créer ton prochain post ?
👉 writedin.netlify.app

À la semaine prochaine !
Issa`,
  },
  {
    id: 'engagement',
    name: '🔥 Réengagement utilisateurs',
    subject: '🔥 On t\'a manqué sur WritedIn',
    message: `Salut 👋

Ça fait un moment qu'on ne t'a pas vu sur WritedIn !

On a ajouté plein de nouvelles fonctionnalités pendant ton absence :

✨ Quoi de neuf ?
• Génération ultra-rapide (2x plus rapide)
• Nouveaux templates professionnels
• Système de favoris amélioré
• Interface encore plus intuitive

🎁 Petit cadeau :
Crée ton prochain post maintenant et découvre les améliorations !

On espère te revoir très vite 💜

Issa
WritedIn`,
  },
  {
    id: 'milestone',
    name: '🎉 Célébration / Milestone',
    subject: '🎉 10,000 posts générés sur WritedIn !',
    message: `Incroyable 🎉

WritedIn vient de franchir les 10,000 posts générés !

Et tout ça grâce à TOI et à notre super communauté de créateurs de contenu.

📈 Les chiffres clés :
• 10,000+ posts générés
• 2,000+ utilisateurs actifs
• 95% de satisfaction
• 50,000+ personnes impactées sur LinkedIn

🙏 Merci infiniment pour ton soutien et ta confiance.

On prépare encore plein de surprises pour les prochaines semaines...

Continue de créer du contenu incroyable 💪

Issa
Fondateur WritedIn`,
  },
  {
    id: 'feedback',
    name: '📊 Demande de feedback',
    subject: '📊 Ton avis compte pour WritedIn',
    message: `Hey 👋

J'ai besoin de TON avis pour améliorer WritedIn !

🤔 3 questions rapides (30 secondes) :

1️⃣ Quelle fonctionnalité tu utilises le plus ?
2️⃣ Qu'est-ce qui pourrait être amélioré ?
3️⃣ Quelle nouvelle fonctionnalité tu aimerais voir ?

Réponds directement à cet email, je lis TOUS les messages personnellement.

Ton feedback est précieux pour faire évoluer WritedIn dans la bonne direction.

Merci d'avance 🙏

Issa
Fondateur WritedIn

P.S. : Les meilleures suggestions seront implémentées en priorité !`,
  },
  {
    id: 'content-tips',
    name: '📝 Astuces création de contenu',
    subject: '📝 3 astuces pour des posts LinkedIn qui cartonnent',
    message: `Salut 👋

Voici mes 3 meilleures astuces pour créer des posts LinkedIn qui génèrent de l'engagement :

1️⃣ Le hook parfait
Les 2 premières lignes sont cruciales. Utilise :
• Une statistique choquante
• Une question intrigante  
• Une promesse claire

2️⃣ Le bon format
• 6-10 lignes max (WritedIn peut le faire pour toi !)
• Des retours à la ligne pour l'aération
• 2-3 émojis stratégiques

3️⃣ Le call-to-action
Termine TOUJOURS par :
• Une question pour inciter aux commentaires
• Un appel à l'action clair
• Une invitation au partage

🎯 Bonus : Utilise WritedIn pour appliquer ces astuces automatiquement !

Prêt à booster ton engagement ?
👉 writedin.netlify.app

À très vite !
Issa`,
  },
  {
    id: 'update-maintenance',
    name: '⚙️ Mise à jour / Maintenance',
    subject: '⚙️ Maintenance programmée WritedIn',
    message: `Hey 👋

Une petite info importante :

🔧 Maintenance programmée
📅 Date : [Indiquer la date]
⏰ Durée : ~30 minutes
🎯 Raison : Amélioration des performances

Pendant cette période, WritedIn sera temporairement indisponible.

✨ Après la maintenance :
• Génération 3x plus rapide
• Meilleure stabilité
• Nouvelles fonctionnalités

On revient encore plus fort ! 💪

Merci de ta patience et compréhension.

Issa
WritedIn

P.S. : On te notifiera dès que tout sera de nouveau opérationnel !`,
  },
];

function IssaAdmin() {
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dryRun, setDryRun] = useState(true);

  const handleTemplateChange = (templateId) => {
    const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      setMessage(template.message);
      setResult(null); // Reset result when changing template
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      alert('Écris un message avant d\'envoyer !');
      return;
    }

    if (!subject.trim()) {
      alert('Ajoute un sujet avant d\'envoyer !');
      return;
    }

    if (!dryRun && !confirm('Tu es sûr d\'envoyer à TOUS les utilisateurs ?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://backend-writedin.onrender.com';
      const adminToken = import.meta.env.VITE_ADMIN_TOKEN || 'une_cle_admin_longue_et_secrete';
      
      const response = await fetch(`${apiUrl}/api/admin/emails/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email-token': adminToken,
        },
        body: JSON.stringify({
          subject: subject.trim(),
          html: generateEmailHTML(message),
          text: message,
          dryRun,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateEmailHTML = (text) => {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f9fafb;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .message {
      font-size: 16px;
      line-height: 1.8;
      color: #4b5563;
      white-space: pre-wrap;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px 20px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 5px 0;
      font-size: 13px;
      color: #6b7280;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✍️ WritedIn</h1>
    </div>

    <div class="content">
      <div class="message">${text}</div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://writedin.netlify.app/studio" class="cta-button">
          Créer un post maintenant →
        </a>
      </div>
    </div>

    <div class="footer">
      <p><strong>WritedIn</strong></p>
      <p>L'outil intelligent pour créer des posts LinkedIn captivants</p>
      <p style="margin-top: 20px;">
        <a href="https://writedin.netlify.app">writedin.netlify.app</a> • 
        <a href="mailto:miganissa334@gmail.com">Contact</a>
      </p>
      <p style="margin-top: 15px; font-size: 11px; color: #9ca3af;">
        © 2026 WritedIn. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <div className="issa-admin">
      <div className="admin-container">
        <div className="admin-header">
          <h1>🔐 Admin Panel - Issa</h1>
          <p>Envoie des emails marketing à tous les utilisateurs WritedIn</p>
        </div>

        <div className="admin-form">
          {/* Sélecteur de template */}
          <div className="form-group">
            <label>Template d'email</label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              disabled={loading}
              className="template-select"
            >
              {EMAIL_TEMPLATES.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sujet de l'email</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: 📧 Nouveautés WritedIn"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Sélectionne un template ou écris ton propre message..."
              rows={12}
              disabled={loading}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={dryRun}
                onChange={(e) => setDryRun(e.target.checked)}
                disabled={loading}
              />
              <span>Mode test (ne pas envoyer réellement)</span>
            </label>
          </div>

          <button
            onClick={handleSend}
            disabled={loading || !message.trim() || !subject.trim()}
            className={`send-button ${dryRun ? 'test-mode' : 'live-mode'}`}
          >
            {loading ? (
              '⏳ Envoi en cours...'
            ) : dryRun ? (
              '🧪 Tester (simulation)'
            ) : (
              '🚀 ENVOYER À TOUS LES UTILISATEURS'
            )}
          </button>
        </div>

        {result && (
          <div className={`result ${result.success ? 'success' : 'error'}`}>
            <h3>{result.success ? '✅ Succès' : '❌ Erreur'}</h3>
            {result.success ? (
              <div>
                <p><strong>Mode:</strong> {result.dryRun ? '🧪 Test (simulation)' : '✅ Envoi réel'}</p>
                <p><strong>Destinataires:</strong> {result.recipients}</p>
                {!result.dryRun && (
                  <>
                    <p><strong>Envoyés:</strong> {result.sent}</p>
                    <p><strong>Échecs:</strong> {result.failed}</p>
                  </>
                )}
                {result.dryRun && result.sample && (
                  <div style={{ marginTop: '15px' }}>
                    <strong>Échantillon d'emails (premiers 5):</strong>
                    <ul style={{ textAlign: 'left', fontSize: '13px', marginTop: '8px' }}>
                      {result.sample.map((email, i) => (
                        <li key={i}>{email}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p>{result.error}</p>
            )}
          </div>
        )}

        <div className="admin-info">
          <h3>ℹ️ Informations</h3>
          <ul>
            <li>Seuls les utilisateurs avec <code>marketingEmails: true</code> recevront l'email</li>
            <li>Le mode test montre combien d'utilisateurs recevraient l'email sans l'envoyer</li>
            <li>L'email sera envoyé depuis <code>litxx.org@gmail.com</code></li>
            <li>Limite: 300 emails/jour (plan gratuit Brevo)</li>
            <li><strong>7 templates</strong> prêts à l'emploi pour gagner du temps !</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default IssaAdmin;
