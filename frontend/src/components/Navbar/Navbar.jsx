import { useContext, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/navbar.css';

const guestLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const userLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/exercise", label: "Exercise" },
  { to: "/diet", label: "Diet" },
  { to: "/progress", label: "Progress" },
  { to: "/chat", label: "AI Chat" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate('/dashboard');
  };

  const displayName = useMemo(() => user?.name || 'Profile', [user]);

  const initials = useMemo(() => {
    if (!user?.name) return 'P';

    return user.name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar__brand">
          <div className="navbar__logo">
            <span className="navbar__logo-icon">✚</span>
            <span className="navbar__logo-text">FitAI-Life</span>
          </div>
        </div>

        <button
          type="button"
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          {(user ? userLinks : guestLinks).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `navbar__link${isActive ? ' active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar__actions">

          {!user ? (
            <>
              <NavLink
                to="/login"
                className="navbar__login-btn"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="navbar__register-btn"
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <div className="navbar__profile">

                <button
                  type="button"
                  className="navbar__profile-toggle"
                  onClick={() => setProfileOpen((prev) => !prev)}
                >
                  <span className="navbar__avatar">
                    {initials}
                  </span>

                  <span>{displayName}</span>
                </button>

                {profileOpen && (

                  <div className="navbar__profile-menu">

                    <NavLink
                      to="/profile"
                      className="navbar__menu-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Profile
                    </NavLink>

                    <button
                      type="button"
                      className="navbar__menu-item"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>

                  </div>

                )}

              </div>
            </>
          )}

        </div>
      </nav>
    </header>
  );
};

export default Navbar;