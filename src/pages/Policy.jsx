import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, FileText, ShieldAlert, Sparkles } from 'lucide-react';
import logo from '../assets/img-png.png';
import './Terms.css';

const Policy = () => {
  return (
    <div className="terms-page">
      <nav className="terms-nav">
        <div className="container">
          <Link to="/" className="terms-logo">
            <img src={logo} alt="WritedIn" />
            <span>WritedIn</span>
          </Link>
          <Link to="/" className="back-btn">
            <ArrowLeft size={18} /> Retour
          </Link>
        </div>
      </nav>

      <main className="terms-content">
        <div className="container narrow">
          <header className="content-header">
            <h1>Politique d'utilisation</h1>
            <p>Derniere mise a jour : 4 mai 2026</p>
          </header>

          <section className="terms-intro">
            <p>
              Cette politique precise les regles d'utilisation de WritedIn pour garder un outil utile, respectueux et professionnel.
            </p>
          </section>

          <div className="terms-grid">
            <div className="terms-section">
              <div className="section-icon"><Sparkles /></div>
              <h2>1. Usage attendu</h2>
              <p>
                WritedIn aide a structurer des idees et a produire des brouillons de posts. Vous restez responsable de relire, adapter et
                valider chaque contenu avant publication.
              </p>
            </div>

            <div className="terms-section">
              <div className="section-icon"><ShieldAlert /></div>
              <h2>2. Contenus interdits</h2>
              <p>
                Il est interdit d'utiliser WritedIn pour produire du contenu haineux, discriminatoire, trompeur, illegal, violent ou visant
                a harceler une personne ou une organisation.
              </p>
            </div>

            <div className="terms-section">
              <div className="section-icon"><Bell /></div>
              <h2>3. Notifications</h2>
              <p>
                Les notifications affichees dans l'application servent a transmettre des annonces produit, informations importantes ou
                messages lies au service.
              </p>
            </div>

            <div className="terms-section">
              <div className="section-icon"><FileText /></div>
              <h2>4. Contact</h2>
              <p>
                Pour toute question concernant cette politique, contactez WritedIn a <strong>@contactemail.writedin</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Policy;
