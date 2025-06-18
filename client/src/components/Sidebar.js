import { useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/me', {
      credentials: 'include', // 🟢 Include the session cookie
    })
      .then(res => {
        if (res.ok) setIsAuthenticated(true);
        else setIsAuthenticated(false);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  return (
    <Navbar bg="dark" data-bs-theme="dark" className="sidebar">
      <Nav className="flex-md-column flex-row">
        <Nav.Link as={Link} to="/" className="nav-item mt-md-3">Haku</Nav.Link>
        <Nav.Link as={Link} to="/about" className="nav-item mt-md-1">Ohjeet</Nav.Link>
        <Nav.Link as={Link} to="/contact" className="nav-item mt-md-1">Ota yhteyttä</Nav.Link>
        <Nav.Link as={Link} to="/profile" className="nav-item mt-md-1">Omat tiedot</Nav.Link>

        {!isAuthenticated ? (
          <Nav.Link as={Link} to="/login" className="nav-item">Kirjaudu</Nav.Link>
        ) : (
          <Nav.Link as={Link} to="/logout" className="nav-item">Kirjaudu ulos</Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
}

export default Sidebar;
