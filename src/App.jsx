
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/dashboard/Home';
import Studio from './pages/dashboard/Studio';
import History from './pages/dashboard/History';
import Favorites from './pages/dashboard/Favorites';
import Profile from './pages/dashboard/Profile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Settings from './pages/dashboard/Settings';
import Landing from './pages/Landing';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Policy from './pages/Policy';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Chargement de WritedIn...</div>;

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Landing />} />
      <Route path="/studio" element={user ? <Studio /> : <Navigate to="/auth/login" />} />
      <Route path="/history" element={user ? <History /> : <Navigate to="/auth/login" />} />
      <Route path="/favorites" element={user ? <Favorites /> : <Navigate to="/auth/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth/login" />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth/login" />} />
      
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/auth/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route path="/auth/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
