import React from 'react';
import Layout from '../../components/Layout';
import DashboardIcon from '../../components/DashboardIcon';

const Templates = () => {
  const templates = [
    { title: "L'Accroche", desc: "Pour captiver dès la première ligne." },
    { title: "L'Histoire", desc: "Pour raconter un moment fort de ta journée." },
    { title: "Le Conseil", desc: "Pour partager ta valeur ajoutée." },
    { title: "L'Appel", desc: "Pour inviter ton audience à l'action." }
  ];

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Mes Modèles</h1>
      </div>

      <div className="content-body">
        <div className="folder-grid">
          {templates.map((tpl, idx) => (
            <div key={idx} className="file-card" style={{ cursor: 'pointer' }}>
              <div style={{ background: '#eff6ff', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                <DashboardIcon name="idea" size={20} color="#3b82f6" />
              </div>
              <div style={{ fontWeight: 700, marginBottom: '8px' }}>{tpl.title}</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{tpl.desc}</div>
              <button className="btn-upgrade" style={{ marginTop: '20px', width: '100%' }}>Utiliser ce modèle</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Templates;
