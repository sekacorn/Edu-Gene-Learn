import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('authToken'));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="app-nav">
      <div className="container mx-auto px-4 app-nav__inner">
        <NavLink className="brand" to="/">EduGeneLearn</NavLink>
        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
          <NavLink className="nav-link" to="/analyze">Analyze</NavLink>
          <NavLink className="nav-link" to="/explore">Explore</NavLink>
          <NavLink className="nav-link" to="/collaborate">Collaborate</NavLink>
          <NavLink className="nav-link" to="/troubleshoot">Troubleshoot</NavLink>
          <NavLink className="nav-link" to="/compliance">Compliance</NavLink>
          {isAuthenticated ? (
            <button className="nav-button" type="button" onClick={handleLogout}>Logout</button>
          ) : (
            <NavLink className="nav-button" to="/login">Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
