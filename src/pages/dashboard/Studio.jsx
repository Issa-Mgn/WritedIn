import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Copy, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import DashboardIcon from '../../components/DashboardIcon';
import { generatePost as generatePostFromApi } from '../../services/api';
import { ensureUserProfile, getUserDraft, getUserSettings, saveGeneratedPost, saveUserDraft } from '../../services/userData';

const quickIdeas = [
  'Une leçon apprise cette semaine',
  'Une erreur que je ne referai plus',
  'Un conseil simple pour mieux écrire',
];

const Studio = () => {
  const location = useLocation();
  const initialTemplate = location.state?.template || null;
  const [input, setInput] = useState(initialTemplate?.prompt || '');
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draftReady, setDraftReady] = useState(Boolean(initialTemplate));
  const [saveStatus, setSaveStatus] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [generationError, setGenerationError] = useState('');
  const [autosaveDrafts, setAutosaveDrafts] = useState(true);
  const typingIntervalRef = useRef(null);
  const { user } = useAuth();

  const [prefs, setPrefs] = useState({
    emojis: true,
    conversational: true,
    hashtags: true,
    professional: true,
    hooks: true,
  });

  const generationOptions = useMemo(() => ({
    useEmojis: Boolean(prefs.emojis),
    maxEmojis: prefs.emojis ? 5 : 0,
    lineCount: 30,
    allowLongPost: true,
    useHashtags: Boolean(prefs.hashtags),
  }), [prefs.emojis, prefs.hashtags]);

  const togglePref = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const loadDraft = async () => {
      try {
        await ensureUserProfile(user);
        const settings = await getUserSettings(user.uid);

        if (settings?.preferences) {
          setPrefs(prev => ({
            ...prev,
            emojis: settings.preferences.defaultEmojis ?? prev.emojis,
            conversational: settings.preferences.defaultConversational ?? prev.conversational,
            hashtags: settings.preferences.defaultHashtags ?? prev.hashtags,
            hooks: settings.preferences.defaultHooks ?? prev.hooks,
            professional: settings.preferences.defaultProfessional ?? prev.professional,
          }));
          setAutosaveDrafts(settings.preferences.autosaveDrafts ?? true);
        }

        if (initialTemplate) {
          setDraftReady(true);
          return;
        }

        const draft = await getUserDraft(user.uid);
        if (cancelled) return;

        if (draft) {
          setInput(draft.input || '');
          setSelectedTemplate(draft.selectedTemplate || null);
          if (draft.preferences) setPrefs(prev => ({ ...prev, ...draft.preferences }));
        }
      } catch (err) {
        console.warn('Draft/profile sync unavailable:', err);
      }

      setDraftReady(true);
    };

    loadDraft();

    return () => {
      cancelled = true;
    };
  }, [user, initialTemplate]);

  useEffect(() => {
    if (!user || !draftReady || !autosaveDrafts) return;

    const timeout = setTimeout(() => {
      saveUserDraft(user.uid, {
        input,
        preferences: prefs,
        selectedTemplate,
      }).catch(err => console.warn('Draft not saved:', err));
    }, 650);

    return () => clearTimeout(timeout);
  }, [user, draftReady, autosaveDrafts, input, prefs, selectedTemplate]);

  const typeText = (text) => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    const chars = Array.from(String(text || ''));

    if (chars.length === 0) {
      setResult('');
      setTyping(false);
      return;
    }

    setResult(chars[0]);
    setTyping(true);
    let index = 1;

    typingIntervalRef.current = setInterval(() => {
      index += 1;
      setResult(chars.slice(0, index).join(''));

      if (index >= chars.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setTyping(false);
      }
    }, 16);
  };

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const savePost = async (content, source, model) => {
    if (!user) return;

    try {
      const saved = await saveGeneratedPost({
        user,
        content,
        source,
        model,
        prompt: input,
        templateTitle: selectedTemplate?.title || null,
      });
      setSaveStatus(saved?.storage === 'firebase' ? 'firebase' : 'failed');
      setSaveError('');
    } catch (err) {
      console.warn('Post generated but not saved:', err);
      setSaveStatus('failed');
      setSaveError(err?.code || err?.message || 'Erreur Firestore inconnue');
    }
  };

  const completeGeneration = async (text, source, model) => {
    setLoading(false);
    typeText(text);
    await savePost(text, source, model);
  };

  const generatePost = async () => {
    if (!input.trim() || !user) return;
    setLoading(true);
    setResult('');
    setSaveStatus(null);
    setSaveError('');
    setGenerationError('');

    try {
      const data = await generatePostFromApi({ text: input, options: generationOptions });
      await completeGeneration(data.post || data.text, data.provider || 'server', data.model || data.provider || 'ai');
    } catch (err) {
      console.warn('Generation API unavailable:', err);
      setLoading(false);
      setGenerationError(err?.message || 'Le service IA est momentanement indisponible.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addQuickIdea = (idea) => {
    setInput(prev => `${prev}${prev.trim() ? '\n\n' : ''}${idea}`);
  };

  return (
    <Layout>
      <div className="studio-page">
        <section className="studio-hero">
          <div>
            <span className="section-kicker">WritedIn Studio</span>
            <h1 className="studio-title">Transformez une idée en post prêt à publier.</h1>
            <p className="studio-subtitle">
              Écrivez librement votre idée, ajustez-la, puis générez un texte parfait avec une vraie structure LinkedIn.
            </p>
          </div>
          <div className="studio-score studio-free-mode">
            <DashboardIcon name="studio" size={28} />
            <strong>Libre</strong>
            <span>Ecrivez moins, Publiez plus.</span>
          </div>
        </section>

        {selectedTemplate && (
          <div className="template-context">
            <div className="template-context-icon">
              <DashboardIcon name={selectedTemplate.icon || 'idea'} size={22} />
            </div>
            <div>
              <span>{selectedTemplate.type}</span>
              <strong>{selectedTemplate.title}</strong>
              <p>{selectedTemplate.preview}</p>
            </div>
            <button type="button" onClick={() => setSelectedTemplate(null)}>Retirer</button>
          </div>
        )}

        <div className="studio-workspace">
          <section className="studio-box studio-editor">
            <div className="studio-box-header">
              <div>
                <span className="section-kicker">Brief</span>
                <h2>De quoi voulez-vous parler ?</h2>
              </div>
              <DashboardIcon name="idea" size={26} color="#0A66C2" />
            </div>

            <textarea
              className="studio-textarea"
              placeholder="Ex: J'ai appris que l'échec est une étape nécessaire du succès..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="quick-ideas">
              {quickIdeas.map(idea => (
                <button key={idea} type="button" onClick={() => addQuickIdea(idea)}>
                  {idea}
                </button>
              ))}
            </div>

            <button className="btn-create-post studio-generate" onClick={generatePost} disabled={loading || typing || !input.trim()}>
              {loading ? <Loader2 className="spin" size={24} /> : <>Générer mon post <ArrowRight size={22} /></>}
            </button>
            {generationError && (
              <p className="studio-save-status failed">{generationError}</p>
            )}
          </section>
          <aside className="studio-box studio-settings">
            <span className="section-kicker">Ligne éditoriale</span>
            <h2>Voix du post</h2>

            <div className="studio-guidance">
              <DashboardIcon name="idea" size={24} />
              <div>
                <strong>Mode création libre</strong>
                <p>Le Studio garde les détails techniques en arrière-plan et laisse la priorité au contenu.</p>
              </div>
            </div>

            <div className="preferences-grid studio-preferences">
              {[
                ['emojis', 'Emojis', 'heart'],
                ['conversational', 'Ton conversationnel', 'idea'],
                ['hashtags', 'Hashtags', 'grid'],
                ['hooks', 'Accroche forte', 'favorites'],
                ['professional', 'Expertise pro', 'studio'],
              ].map(([key, label, icon]) => (
                <button
                  key={key}
                  type="button"
                  className={`pref-item pref-button ${prefs[key] ? 'active' : ''}`}
                  onClick={() => togglePref(key)}
                >
                  <DashboardIcon name={icon} size={20} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </aside>
        </div>

        {(result || typing) && (
          <section className="studio-box studio-result">
            <div className="studio-box-header">
              <div>
                <span className="section-kicker">Résultat</span>
                <h2>Votre post WritedIn</h2>
              </div>
              {result && !typing && (
                <button onClick={copyToClipboard} className="copy-button">
                  <Copy size={18} /> {copied ? 'Copié !' : 'Copier'}
                </button>
              )}
            </div>
            {saveStatus && (
              <p className={`studio-save-status ${saveStatus}`}>
                {saveStatus === 'firebase' && 'Sauvegardé dans Firebase. Il apparaîtra dans l’historique.'}
                {saveStatus === 'failed' && `Le post est généré, mais Firestore a refusé la sauvegarde${saveError ? ` : ${saveError}` : '.'}`}
              </p>
            )}
            <div className="generated-post">
              {result}
              {typing && <span className="typing-cursor">|</span>}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Studio;
