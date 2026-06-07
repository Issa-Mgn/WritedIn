import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import logo from '../assets/img-png.png';
import DashboardIcon from './DashboardIcon';
import { getUserProfile, hideNotifications, markNotificationsRead, markWelcomeNotificationSeen, subscribeGlobalNotifications } from '../services/userData';
import { subscribeForegroundMessages } from '../services/notifications';

const mainNavItems = [
  { path: '/', label: 'Accueil', icon: 'home', description: 'Vue generale' },
  { path: '/studio', label: 'WritedIn Studio', icon: 'studio', description: 'Creation de posts' },
  { path: '/history', label: 'Historique', icon: 'reload', description: 'Posts sauvegardes' },
  { path: '/favorites', label: 'Favoris', icon: 'heart', description: 'Trames preferees' },
];

const personalNavItems = [
  { path: '/settings', label: 'Parametres', icon: 'settings', description: 'Preferences' },
  { path: '/profile', label: 'Mon Compte', icon: 'user', description: 'Profil et stats' },
];

const Layout = ({ children }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotificationIds, setReadNotificationIds] = useState([]);
  const [hiddenNotificationIds, setHiddenNotificationIds] = useState([]);
  const [welcomeBanner, setWelcomeBanner] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return undefined;

    let cancelled = false;

    const loadWelcome = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        if (cancelled) return;

        const readIds = Array.isArray(profile?.readNotificationIds) ? profile.readNotificationIds : [];
        const hiddenIds = Array.isArray(profile?.hiddenNotificationIds) ? profile.hiddenNotificationIds : [];
        setReadNotificationIds(readIds);
        setHiddenNotificationIds(hiddenIds);

        if (profile?.welcomeNotificationSeen || readIds.includes('welcome') || hiddenIds.includes('welcome')) return;

        const displayName = user.displayName || user.email?.split('@')[0] || 'créateur';
        const welcome = {
          id: 'welcome',
          title: 'Bienvenue sur WritedIn',
          body: `Ravi de vous revoir, ${displayName}. Votre Studio est prêt pour transformer vos idées en posts LinkedIn.`,
          source: 'system',
          createdAt: new Date().toISOString(),
        };

        setWelcomeBanner(welcome);
        setNotifications(prev => [welcome, ...prev.filter(item => item.id !== 'welcome')]);
      } catch (err) {
        console.warn('Welcome notification unavailable:', err);
      }
    };

    loadWelcome();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user || !welcomeBanner) return undefined;

    const timeout = setTimeout(() => {
      dismissWelcome();
    }, 9000);

    return () => clearTimeout(timeout);
  }, [user, welcomeBanner]);

  useEffect(() => {
    if (!user) return undefined;

    setNotificationStatus('');
    return subscribeGlobalNotifications(
      (items) => {
        setNotificationStatus(`Firestore connecte - ${items.length} notification${items.length > 1 ? 's' : ''} lue${items.length > 1 ? 's' : ''}.`);
        setNotifications(prev => {
          const localItems = prev.filter(item => item.source === 'system' || item.source === 'fcm');
          return [...localItems, ...items];
        });
      },
      (err) => {
        console.warn('Global notifications unavailable:', err);
        setNotificationStatus(err?.code || err?.message || 'Erreur Firestore notifications');
      }
    );
  }, [user]);

  useEffect(() => {
    let unsubscribe = () => {};

    subscribeForegroundMessages((message) => {
      setNotifications(prev => [message, ...prev]);
      setWelcomeBanner(message);
    }).then((handler) => {
      unsubscribe = handler;
    });

    return () => unsubscribe?.();
  }, []);

  const visibleNotifications = useMemo(
    () => notifications.filter(item => !hiddenNotificationIds.includes(item.id)),
    [notifications, hiddenNotificationIds]
  );

  const unreadCount = useMemo(
    () => visibleNotifications.filter(item => !readNotificationIds.includes(item.id)).length,
    [visibleNotifications, readNotificationIds]
  );

  const handleLogout = async () => {
    try {
      await logout();
      setMobileNavOpen(false);
      navigate('/auth/login');
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const currentPage = useMemo(() => {
    return [...mainNavItems, ...personalNavItems].find(item => item.path === location.pathname) || {
      label: 'WritedIn',
      description: 'Tableau de bord',
    };
  }, [location.pathname]);

  const navigateTo = (path) => {
    setMobileNavOpen(false);
    navigate(path);
  };

  const dismissWelcome = async () => {
    const current = welcomeBanner;
    setWelcomeBanner(null);

    if (user && current?.id === 'welcome') {
      markWelcomeNotificationSeen(user).catch(err => console.warn('Welcome state not saved:', err));
    }
  };

  const markAllNotificationsAsRead = async () => {
    const ids = visibleNotifications.map(item => item.id).filter(Boolean);
    if (ids.length === 0) return;

    setReadNotificationIds(prev => [...new Set([...prev, ...ids])]);
    setWelcomeBanner(null);

    if (user) {
      if (ids.includes('welcome')) {
        markWelcomeNotificationSeen(user).catch(err => console.warn('Welcome state not saved:', err));
      }
      markNotificationsRead(user, ids).catch(err => console.warn('Read notifications not saved:', err));
    }
  };

  const clearNotifications = async (idsToHide = visibleNotifications.map(item => item.id)) => {
    const ids = [...new Set(idsToHide.filter(Boolean))];
    if (ids.length === 0) return;

    setHiddenNotificationIds(prev => [...new Set([...prev, ...ids])]);
    setReadNotificationIds(prev => [...new Set([...prev, ...ids])]);

    if (ids.includes('welcome')) {
      setWelcomeBanner(null);
    }

    if (user) {
      if (ids.includes('welcome')) {
        markWelcomeNotificationSeen(user).catch(err => console.warn('Welcome state not saved:', err));
      }
      markNotificationsRead(user, ids).catch(err => console.warn('Read notifications not saved:', err));
      hideNotifications(user, ids).catch(err => console.warn('Hidden notifications not saved:', err));
    }
  };

  return (
    <div className="dashboard-layout">
      {mobileNavOpen && (
        <button
          className="dashboard-drawer-overlay"
          aria-label="Fermer la navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* --- Sidebar Verticale --- */}
      <aside className={`sidebar-main ${mobileNavOpen ? 'drawer-open' : ''}`}>
        <div className="sidebar-logo" onClick={() => navigateTo('/')} style={{ cursor: 'pointer' }}>
          <img className="sidebar-logo-mark" src={logo} alt="W" />
          <span>WritedIn</span>
          <button className="drawer-close-btn" onClick={(e) => { e.stopPropagation(); setMobileNavOpen(false); }} aria-label="Fermer le menu">
            <X size={20} />
          </button>
        </div>

        <nav className="nav-group">
          <div className={`nav-item ${isActive('/') ? 'active' : ''}`} onClick={() => navigateTo('/')}>
            <DashboardIcon name="home" size={20} />
            <span>Accueil</span>
          </div>
          <div className={`nav-item ${isActive('/studio') ? 'active' : ''}`} onClick={() => navigateTo('/studio')}>
            <DashboardIcon name="studio" size={20} />
            <span>WritedIn Studio</span>
          </div>
          <div className={`nav-item ${isActive('/history') ? 'active' : ''}`} onClick={() => navigateTo('/history')}>
            <DashboardIcon name="reload" size={20} />
            <span>Historique</span>
          </div>
          <div className={`nav-item ${isActive('/favorites') ? 'active' : ''}`} onClick={() => navigateTo('/favorites')}>
            <DashboardIcon name="heart" size={20} />
            <span>Favoris</span>
          </div>

          <div className="nav-section-label">Personnel</div>
          
          <div className={`nav-item ${isActive('/settings') ? 'active' : ''}`} onClick={() => navigateTo('/settings')}>
            <DashboardIcon name="settings" size={20} />
            <span>Paramètres</span>
          </div>
          <div className={`nav-item ${isActive('/profile') ? 'active' : ''}`} onClick={() => navigateTo('/profile')}>
            <DashboardIcon name="user" size={20} />
            <span>Mon Compte</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item nav-logout">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* --- Zone de Contenu --- */}
      <div className="main-wrapper">
        <header className="top-header">
          <div className="header-left">
            <button
              className="dashboard-menu-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Ouvrir la navigation"
            >
              <Menu size={22} />
            </button>
            <div className="header-title-block">
              <strong>{currentPage.label}</strong>
            </div>
          </div>
          <div id="header-search-portal" className="header-search-slot"></div>
          <div className="header-actions">
            <div className="notification-shell">
              <button
                type="button"
                className="notification-trigger"
                onClick={() => setNotificationsOpen(prev => !prev)}
                aria-label="Ouvrir les notifications"
              >
                <Bell size={21} />
                {unreadCount > 0 && <span className="notification-dot">{Math.min(unreadCount, 9)}</span>}
              </button>

              {notificationsOpen && (
                <div className="notification-panel">
                  <div className="notification-panel-header">
                    <strong className="notification-status">Notifications</strong>
                    {visibleNotifications.length > 0 && (
                      <div className="notification-panel-actions">
                        <button type="button" onClick={markAllNotificationsAsRead}>
                          Tout lu
                        </button>
                        <button type="button" onClick={() => clearNotifications()} aria-label="Nettoyer les notifications">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  {/* <p className="notification-helper">
                    Les messages ajoutés dans Firestore s’affichent ici pour tous les utilisateurs connectés.
                  </p> */}
                  {/* {notificationStatus && <p className="notification-status">{notificationStatus}</p>} */}
                  <div className="notification-list">
                    {visibleNotifications.length === 0 ? (
                      <p className="notification-empty">Aucune notification pour le moment.</p>
                    ) : (
                      visibleNotifications.slice(0, 8).map(item => (
                        <article
                          key={item.id}
                          className={`notification-item ${readNotificationIds.includes(item.id) ? 'read' : ''}`}
                        >
                          <div className="notification-item-head">
                            <strong>{item.title || 'WritedIn'}</strong>
                            <button type="button" onClick={() => clearNotifications([item.id])} aria-label="Retirer cette notification">
                              <X size={14} />
                            </button>
                          </div>
                          <p>{item.body || item.message || 'Nouveau message disponible.'}</p>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="header-user">
               <div className="header-avatar">
                {user?.email?.[0].toUpperCase()}
               </div>
               <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{user?.displayName || 'Créateur'}</span>
            </div>
          </div>
        </header>

        {welcomeBanner && (
          <div className="welcome-toast">
            <div>
              <strong>{welcomeBanner.title}</strong>
              <p>{welcomeBanner.body}</p>
            </div>
            <button type="button" onClick={dismissWelcome} aria-label="Fermer">
              <X size={18} />
            </button>
          </div>
        )}
        
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
