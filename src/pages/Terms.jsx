import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Check } from 'lucide-react';
import logo from '../assets/img-png.png';
import './Terms.css';

const Terms = () => {
  return (
    <div className="terms-page">
      {/* --- Minimal Header --- */}
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

      {/* --- Content --- */}
      <main className="terms-content">
        <div className="container narrow">
          <header className="content-header">
            <h1>Conditions Générales d'Utilisation</h1>
            <p>Derniere mise a jour : 4 mai 2026</p>
          </header>

          <section className="terms-intro">
            <p>
              Bienvenue sur WritedIn. En utilisant notre plateforme, vous acceptez de vous conformer aux présentes conditions. 
              Veuillez les lire attentivement car elles constituent un contrat entre vous et WritedIn.
            </p>
          </section>

          <div className="terms-grid">
            <div className="terms-section">
              <div className="section-icon"><Check /></div>
              <h2>1. Inscription et Compte</h2>
              <p>
                Pour accéder à nos services, vous devez créer un compte. Vous êtes responsable de la confidentialité de vos identifiants 
                et de toutes les activités effectuées sous votre compte. Vous devez avoir au moins 18 ans pour utiliser WritedIn.
              </p>
            </div>

            <div className="terms-section">
              <div className="section-icon"><Shield /></div>
              <h2>2. Propriété du Contenu</h2>
              <p>
                <strong>Le contenu vous appartient.</strong> WritedIn ne revendique aucun droit de propriété sur les textes, idées ou 
                publications générés par l'IA à partir de vos instructions. Vous êtes libre d'utiliser, copier et publier ce contenu 
                sur LinkedIn ou ailleurs.
              </p>
            </div>

            <div className="terms-section">
              <div className="section-icon"><FileText /></div>
              <h2>3. Utilisation de l'IA</h2>
              <p>
                WritedIn utilise des modèles de langage avancés. Bien que nous nous efforcions de fournir des résultats de haute qualité, 
                vous reconnaissez que le contenu généré par l'IA peut parfois être inexact ou inapproprié. <strong>Il est de votre responsabilité 
                de relire et de valider tout contenu avant publication.</strong>
              </p>
            </div>

            <div className="terms-section">
              <div className="section-icon"><Shield /></div>
              <h2>4. Comportements Interdits</h2>
              <p>
                Vous vous engagez à ne pas utiliser WritedIn pour :
              </p>
              <ul>
                <li>Générer du contenu haineux, violent ou discriminatoire.</li>
                <li>Harceler des individus ou diffuser de fausses informations.</li>
                <li>Tenter d'extraire le code source ou de contourner nos mesures de sécurité.</li>
                <li>Utiliser des systèmes automatisés (bots) pour accéder au service sans autorisation.</li>
              </ul>
            </div>

            <div className="terms-section">
              <div className="section-icon"><FileText /></div>
              <h2>5. Limitation de Responsabilité</h2>
              <p>
                WritedIn est fourni "en l'état". Nous ne pouvons être tenus responsables des conséquences liées à la publication de 
                contenus générés sur votre profil LinkedIn, incluant mais ne se limitant pas à des suspensions de compte par LinkedIn 
                ou des dommages à votre réputation.
              </p>
            </div>

            <div className="terms-section">
              <div className="section-icon"><Shield /></div>
              <h2>6. Modification des Services</h2>
              <p>
                Nous nous réservons le droit de modifier, suspendre ou interrompre tout ou partie de nos services à tout moment. 
                Les utilisateurs seront informés de toute modification majeure des présentes conditions par email ou via la plateforme.
              </p>
            </div>
          </div>

          <footer className="terms-footer-note">
            <p>Vous avez des questions ? Contactez WritedIn a <strong>@contactemail.writedin</strong></p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Terms;
