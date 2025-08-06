import { useEffect, useState } from 'react';
import logo from '../assets/images/waativalogo.png'
import config from '../devprodConfig';

function Sidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_URL = config.apiBaseUrl;

  const checkAuth = () => {
    fetch(`${API_URL}/me`, {
      credentials: 'include',
    })
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include',
    });

    // checkAuth(); // 🔁 Refresh auth state after logout
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light p-2 border rounded shadow-sm flex-lg-column">
      <div className="d-flex align-items-center justify-content-between w-100">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="Logo"
          />
          WAATIVA
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>

      <div
        className="collapse navbar-collapse flex-lg-column text-center mt-3 mt-lg-0"
        id="navbarSupportedContent"
      >
        <ul className="navbar-nav mr-auto flex-lg-column gap-3">
          <li className="nav-item active mt-3">
            <a
              className="nav-link border rounded px-2 mx-1 border-success"
              href="/"
            >
              Haku
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link border rounded px-2 mx-1 border-success"
              href="/taloyhtiokortit"
            >
              Kortit
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link border rounded px-2 mx-1 border-success"
              href="/about"
            >
              Ohjeet
            </a>
          </li>

          {isAuthenticated && (
            <li className="nav-item">
              <a
                className="nav-link border rounded px-2 mx-1 border-success"
                href="/Profile"
              >
                Omat tiedot
              </a>
            </li>
          )}

          <li className="nav-item">
            {!isAuthenticated ? (
              <a
                className="nav-link border rounded px-2 mx-1 border-success"
                href="/login"
              >
                Kirjaudu
              </a>
            ) : (
              <a
                className="nav-link border rounded px-2 mx-1 border-danger"
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
              >
                Kirjaudu ulos
              </a>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}


export default Sidebar;
