import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Target, PenTool, Search, 
  MessageCircle, BarChart3, Clock, Sparkles,
  Shield, Globe, Check, Share2, Edit3, HelpCircle, Info,
  Menu, X, ExternalLink, Mail
} from 'lucide-react';
import logo from '../assets/img-png.png';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('landing-menu-lock', mobileMenuOpen);

    return () => {
      document.body.classList.remove('landing-menu-lock');
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const useCases = [
    {
      icon: <PenTool size={22} />,
      title: 'Créer régulièrement',
      text: 'Transformez une note rapide en post structuré pour garder le rythme sans forcer.',
    },
    {
      icon: <MessageCircle size={22} />,
      title: 'Lancer une discussion',
      text: 'Ajoutez une accroche, une opinion claire et une question pour inviter les réponses.',
    },
    {
      icon: <Search size={22} />,
      title: 'Clarifier une idée',
      text: 'Passez d’une pensée confuse à un angle lisible, utile et facile à publier.',
    },
  ];

  const starterTemplates = [
    'Le retour d’expérience',
    'La leçon apprise',
    'Le contre-pied',
    'La checklist utile',
    'L’erreur classique',
    'Le bilan de semaine',
  ];

  const faqItems = [
    {
      question: 'Est-ce que WritedIn écrit à ma place ?',
      answer: 'Non. WritedIn vous aide à structurer votre idée, mais vous gardez la main sur le fond, le ton et la publication finale.',
    },
    {
      question: 'Puis-je utiliser mes propres idées ?',
      answer: 'Oui. C’est même le principe : vous partez d’une idée brute, puis le Studio propose une version plus claire et mieux structurée.',
    },
    {
      question: 'Est-ce adapté aux débutants sur LinkedIn ?',
      answer: 'Oui. Les trames guident les premières publications et évitent de rester bloqué devant une page blanche.',
    },
    {
      question: 'Mes textes sont-ils sauvegardés ?',
      answer: 'Quand vous êtes connecté, vos générations peuvent être retrouvées dans votre historique pour les copier ou les retravailler.',
    },
  ];

  return (
    <div className="landing-page">
      {/* Background subtil */}
      <div className="bg-glow-container">
        <div className="glow-orb g1"></div>
        <div className="glow-orb g2"></div>
      </div>

      {/* --- Header Fixé avec Dropdowns --- */}
      <nav className={`landing-nav-simple ${mobileMenuOpen ? 'menu-open' : ''}`}>
        <div className="container nav-flex">
          <div className="logo-section" onClick={() => navigate('/')}>
            <img src={logo} alt="WritedIn" className="nav-logo-img" />
            <span className="brand-name">WritedIn</span>
          </div>

          <div className="nav-center-links">
            <button onClick={() => scrollToSection('use-cases')} className="nav-item">Cas d’usage</button>
            <button onClick={() => scrollToSection('how-it-works')} className="nav-item">Méthode</button>
            <button onClick={() => scrollToSection('features')} className="nav-item">Fonctionnalités</button>
            <button onClick={() => scrollToSection('faq')} className="nav-item">FAQ</button>
          </div>

          <div className="nav-actions">
            <button className="nav-link-simple" onClick={() => navigate('/auth/login')}>Connexion</button>
            <button className="btn-primary-pill" onClick={() => navigate('/auth/register')}>
              Démarrer gratuitement
            </button>
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu-panel">
            <div className="mobile-menu-links">
              <button onClick={() => scrollToSection('use-cases')}>Cas d’usage</button>
              <button onClick={() => scrollToSection('how-it-works')}>Méthode</button>
              <button onClick={() => scrollToSection('features')}>Fonctionnalités</button>
              <button onClick={() => scrollToSection('faq')}>FAQ</button>
            </div>

            <div className="mobile-menu-actions">
              <button onClick={() => navigate('/auth/login')}>Connexion</button>
              <button onClick={() => navigate('/auth/register')}>
                Démarrer <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <header className="hero-section">
        <div className="container hero-split-grid">
          <div className="hero-left-content">
            <h1 className="hero-title-main">
              Arrêtez de lutter contre la <br/><span>page blanche.</span>
            </h1>
            <p className="hero-description">
              WritedIn transforme vos idées brutes en publications LinkedIn captivantes. 
              Écrivez moins, publiez plus.
            </p>
            <div className="hero-actions-group">
              <button className="btn-hero-pro" onClick={() => navigate('/auth/register')}>
                Créer mon premier post <ArrowRight size={20} />
              </button>
              <div className="hero-meta">Pas de carte bancaire • Accès gratuit</div>
            </div>
          </div>

          <div className="hero-right-visual">
            <div className="demo-dashboard-3d">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="mockup-tab">WritedIn Editor</div>
              </div>
              <div className="mockup-body">
                <div className="mockup-editor">
                  <div className="editor-label">Votre idée...</div>
                  <div className="editor-input-sim">
                    Pourquoi j'ai décidé de partager mon aventure de créateur même si j'ai peur de ne pas être intéressant.
                  </div>
                  <button className="editor-btn-sim">Générer le post</button>
                </div>
                <div className="mockup-preview">
                  <div className="preview-label">Résultat IA</div>
                  <div className="preview-content-sim">
                    ✨ <strong>Le plus dur, c'est de commencer...</strong><br/><br/>
                    On pense souvent qu'il faut être un expert pour prendre la parole. C'est faux.<br/><br/>
                    L'authenticité bat la perfection à chaque fois. Voici pourquoi j'ai décidé de sortir de l'ombre...
                  </div>
                  <div className="preview-footer-sim">
                    <span>#Authenticité</span>
                    <span>#Parcours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Section Cas d'usage --- */}
      <section id="use-cases" className="use-cases-section">
        <div className="container">
          <div className="section-header-centered">
            <span className="badge-pro">Utile au quotidien</span>
            <h2>Des usages simples pour publier plus facilement.</h2>
            <p>WritedIn vous aide surtout dans les moments où l’idée existe déjà, mais où la forme bloque encore.</p>
          </div>

          <div className="use-cases-grid">
            {useCases.map((item) => (
              <div className="use-case-card" key={item.title}>
                <div className="use-case-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section Trames --- */}
      <section className="template-library-section">
        <div className="container template-library-grid">
          <div className="template-library-copy">
            <span className="badge-pro">Bibliothèque</span>
            <h2>Des trames pour ne plus repartir de zéro.</h2>
            <p>
              Choisissez un angle, ajoutez votre idée, puis envoyez directement la base dans WritedIn Studio.
              C’est pensé pour écrire vite sans publier du contenu générique.
            </p>
            <button className="btn-hero-pro" onClick={() => navigate('/auth/register')}>
              Tester les trames <ArrowRight size={20} />
            </button>
          </div>

          <div className="template-chip-panel">
            {starterTemplates.map((template) => (
              <div className="template-chip" key={template}>
                <Check size={16} />
                <span>{template}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 3 Étapes (Keep for main page too) --- */}
      <section id="how-it-works" className="steps-section">
        <div className="container">
          <div className="section-header-centered">
            <span className="badge-pro">Nos Méthodes</span>
            <h2>De l'idée au post viral en 30 secondes.</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">01</div>
              <div className="step-icon-box"><Edit3 /></div>
              <h3>Pitcher l'idée</h3>
              <p>Écrivez simplement ce que vous avez en tête, sans vous soucier de la forme.</p>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <div className="step-icon-box"><Sparkles /></div>
              <h3>IA Persuasive</h3>
              <p>Notre moteur transforme votre pensée en un post structuré avec les frameworks AIDA/PAS.</p>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <div className="step-icon-box"><Share2 /></div>
              <h3>Publier & Briller</h3>
              <p>Copiez, collez sur LinkedIn et observez l'engagement monter.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section Avant / Après --- */}
      <section className="before-after-section">
        <div className="container">
          <div className="section-header-centered">
            <span className="badge-pro">Exemple concret</span>
            <h2>Une idée brute devient un post clair.</h2>
          </div>

          <div className="before-after-grid">
            <div className="writing-sample-card">
              <div className="sample-label"><Info size={16} /> Idée brute</div>
              <p>Je veux parler du fait que j’ai peur de poster mais que je sais que je dois commencer.</p>
            </div>
            <div className="writing-sample-card refined">
              <div className="sample-label"><Sparkles size={16} /> Version structurée</div>
              <p>
                Le plus dur sur LinkedIn, ce n’est pas d’avoir une idée. C’est d’oser la publier.
                J’ai longtemps attendu d’être “plus légitime”. Aujourd’hui, je comprends que la clarté vient en écrivant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section Ingénierie --- */}
      <section id="features" className="features-section-light">
        <div className="container">
          <div className="features-main-grid">
            <div className="features-text">
              <span className="badge-pro">Technologie</span>
              <h2>Une ingénierie dédiée à l'impact.</h2>
              <p>WritedIn n'est pas qu'un simple générateur. C'est un moteur de persuasion entraîné sur les mécaniques psychologiques de LinkedIn.</p>
              
              <div className="feature-item-mini">
                <div className="mini-icon"><Check size={18} /></div>
                <div>
                  <h4>Moteur AIDA & PAS</h4>
                  <p>Structure optimisée pour capter l'attention dès la première ligne.</p>
                </div>
              </div>
              <div className="feature-item-mini">
                <div className="mini-icon"><Check size={18} /></div>
                <div>
                  <h4>Optimisation Algo</h4>
                  <p>Formatage spécifique (aéré, accroches courtes) favorisant le "See more".</p>
                </div>
              </div>
            </div>
            <div className="features-visual-grid">
              <div className="f-visual-card">
                <BarChart3 className="v-icon" />
                <h4>Analyse de tonalité</h4>
                <p>Ajuste le ton selon votre personnalité.</p>
              </div>
              <div className="f-visual-card">
                <Target className="v-icon" />
                <h4>Ciblage Audience</h4>
                <p>Mots-clés stratégiques intégrés.</p>
              </div>
              <div className="f-visual-card">
                <Clock className="v-icon" />
                <h4>Gain de Temps</h4>
                <p>-85% de temps de rédaction.</p>
              </div>
              <div className="f-visual-card">
                <Shield className="v-icon" />
                <h4>100% Sécurisé</h4>
                <p>Vos données vous appartiennent.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="faq-section-pro">
        <div className="container">
          <div className="section-header-centered">
            <span className="badge-pro">FAQ</span>
            <h2>Les questions avant de commencer.</h2>
          </div>

          <div className="faq-grid">
            {faqItems.map((item, index) => (
              <div
                key={item.question}
                className={`faq-item-pro ${activeFaq === index ? 'active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="faq-q">
                  <span>{item.question}</span>
                  <HelpCircle size={18} />
                </div>
                <div className="faq-a">{item.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer Pro --- */}
      <footer className="footer-pro">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-info">
              <div className="footer-logo">
                <img src={logo} alt="WritedIn" className="footer-logo-img" />
                <span>WritedIn</span>
              </div>
              <p>L'IA qui donne une voix aux professionnels sur LinkedIn.</p>
            </div>
            <div className="footer-nav-col">
              <h4>Produit</h4>
              <button onClick={() => scrollToSection('features')}>Fonctionnalités</button>
              <button onClick={() => scrollToSection('how-it-works')}>Méthode</button>
            </div>
            <div className="footer-nav-col">
              <h4>Légal</h4>
              <Link to="/terms">Conditions</Link>
              <Link to="/privacy">Confidentialité</Link>
              <Link to="/policy">Politique</Link>
            </div>
            <div className="footer-nav-col">
              <h4>Contact</h4>
              <a href="mailto:miganissa334@gmail.com?subject=Contact%20WritedIn">
                <Mail size={16} aria-hidden="true" />
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/issa-migan-520051362"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={16} aria-hidden="true" />
                LinkedIn
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-powered">
              Powered By{' '}
              <a href="https://litxxcompany.netlify.app/" target="_blank" rel="noreferrer">
                L!txx
              </a>
            </p>
            <p>© 2026 WritedIn.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
