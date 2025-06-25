import { useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    fetch('http://localhost:3001/me', {
      credentials: 'include',
    })
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:3001/auth/logout', {
      method: 'GET',
      credentials: 'include',
    });

    checkAuth(); // 🔁 Refresh auth state after logout
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" className="sidebar">
      <Nav className="flex-md-column flex-row">
        <Nav.Link as={Link} to="/" className="nav-item mt-md-3">Kiinteistöhaku</Nav.Link>
        <Nav.Link as={Link} to="/taloyhtiokortit" className="nav-item mt-md-3">Taloyhtiökortit</Nav.Link>
        <Nav.Link as={Link} to="/about" className="nav-item mt-md-1">Ohjeet</Nav.Link>
        <Nav.Link as={Link} to="/contact" className="nav-item mt-md-1">Ota yhteyttä</Nav.Link>
        <Nav.Link as={Link} to="/Profile" className="nav-item mt-md-1">Omat tiedot</Nav.Link>

        {!isAuthenticated ? (
          <Nav.Link as={Link} to="/login" className="nav-item">Kirjaudu</Nav.Link>
        ) : (
          <Nav.Link as="button" onClick={handleLogout} className="nav-item btn btn-link">Kirjaudu ulos</Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
}


export default Sidebar;
