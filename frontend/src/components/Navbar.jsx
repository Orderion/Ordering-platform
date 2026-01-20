import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, login, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🚀</span>
            <span className="brand-text">OrderPlatform</span>
          </Link>

          <div className="navbar-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/order" className="nav-link">Order Now</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                {user.githubId === import.meta.env.VITE_ADMIN_GITHUB_ID && (
                  <Link to="/admin" className="nav-link">Admin</Link>
                )}
                <div className="user-menu">
                  <img 
                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                    alt={user.name}
                    className="user-avatar"
                  />
                  <span className="user-name">{user.name}</span>
                  <button onClick={logout} className="btn-logout">Logout</button>
                </div>
              </>
            ) : (
              <button onClick={login} className="btn-primary">
                Login with GitHub
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
