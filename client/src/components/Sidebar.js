import { useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/images/waativalogo.png'

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

    // checkAuth(); // 🔁 Refresh auth state after logout
    window.location.reload();
  };

  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light flex-column p-2">
        <a className="navbar-brand" href="#">      
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
          /> WAATIVA
        </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

        <div className="collapse navbar-collapse flex-column text-center" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto flex-column gap-3">
            <li className="nav-item active mt-3">
              <a className="nav-link border rounded px-2 mx-1 border border-success" href="/">Haku</a>
            </li>
            <li className="nav-item">
              <a className="nav-link border rounded px-2 mx-1 border border-success" href="/taloyhtiokortit">Kortit</a>
            </li>
            <li className="nav-item">
              <a className="nav-link border rounded px-2 mx-1 border border-success" href="/about">Ohjeet</a>
            </li>
            <li className="nav-item">
              <a className="nav-link border rounded px-2 mx-1 border border-success" href="/Profile">Omat tiedot</a>
            </li>
            <li className="nav-item">
              {!isAuthenticated ? (
                  <a className="nav-link border rounded px-2 mx-1 border border-success" href="/login">Kirjaudu</a>
                ):(
                  <a className="nav-link border rounded px-2 mx-1 border border-danger" onClick={handleLogout}>Kirjaudu ulos</a>
                )}
            </li>



          </ul>
        </div>
      </nav>
  );
}


export default Sidebar;
