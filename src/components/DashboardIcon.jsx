import gridIcon from '../assets/icones/a-carreaux.png';
import heartIcon from '../assets/icones/coeur.png';
import layersIcon from '../assets/icones/couches.png';
import favoriteIcon from '../assets/icones/favoris.png';
import ideaIcon from '../assets/icones/idee.png';
import infoIcon from '../assets/icones/information.png';
import homeIcon from '../assets/icones/maison.png';
import eyeIcon from '../assets/icones/oeil.png';
import settingsIcon from '../assets/icones/parametres.png';
import reloadIcon from '../assets/icones/recharger.png';
import penIcon from '../assets/icones/stylo.png';
import userIcon from '../assets/icones/utilisateur.png';

const dashboardIcons = {
  grid: gridIcon,
  heart: heartIcon,
  layers: layersIcon,
  favorites: favoriteIcon,
  idea: ideaIcon,
  info: infoIcon,
  home: homeIcon,
  eye: eyeIcon,
  settings: settingsIcon,
  reload: reloadIcon,
  studio: penIcon,
  user: userIcon,
};

const DashboardIcon = ({
  name,
  size = 20,
  color = 'currentColor',
  title,
  className = '',
  style,
}) => {
  const source = dashboardIcons[name];

  if (!source) return null;

  return (
    <span
      className={`dashboard-icon dashboard-icon-${name} ${className}`.trim()}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      style={{
        '--icon-url': `url(${source})`,
        '--icon-size': `${size}px`,
        color,
        ...style,
      }}
    />
  );
};

export default DashboardIcon;
