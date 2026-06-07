import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, EyeOff, Lock, Shield } from 'lucide-react';
import logo from '../assets/img-png.png';
import './Terms.css';

const Privacy = () => {
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
            <h1>Politique de confidentialite</h1>
            <p>Derniere mise a jour : 4 mai 2026</p>
          </header>

          <section className="terms-intro">
            <p>
              Cette politique explique comment WritedIn collecte, utilise et protege les informations liees a votre compte et a vos contenus.
            </p>
          </section>

          <div className="terms-grid">
            <div className="terms-section">
              <div className="section-icon"><Database /></div>
              <h2>1. Donnees collectees</h2>
              <p>
                Nous collectons les informations necessaires au fonctionnement du service : email, nom affiche, preferences, brouillons,
                favoris, historique de generations et notifications lues ou masquees.
              </p>
            </div>

            <div className="terms-section">
              <div className="section-icon"><Shield /></div>
              <h2>2. Utilisation des donnees</h2>
              <p>
                Ces donnees servent a connecter votre compte, sauvegarder votre travail, personnaliser l'experience et ameliorer la qualite
                des fonctionnalites de redaction.
              </p>
            </div>

            <div className="terms-section">
              <div className="section-icon"><Lock /></div>
              <h2>3. Protection</h2>
              <p>
                L'acces aux donnees utilisateur est protege par Firebase Authentication et par des regles Firestore limitees au proprietaire
                du compte lorsque les donnees sont personnelles.
              </p>
            </div>

            <div className="terms-section">
              <div className="section-icon"><EyeOff /></div>
              <h2>4. Vos droits</h2>
              <p>
                Vous pouvez demander l'acces, la correction ou la suppression des informations associees a votre compte en nous contactant
                a <strong>@contactemail.writedin</strong>.
              </p>
            </div>
          </div>

          <footer className="terms-footer-note">
            <p>Contact confidentialite : <strong>@contactemail.writedin</strong></p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
