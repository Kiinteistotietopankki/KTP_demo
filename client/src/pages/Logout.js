import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../devprodConfig';

function Logout() {
  const navigate = useNavigate();

  const API_URL = config.apiBaseUrl;

  useEffect(() => {
    const doLogout = async () => {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'GET',
          credentials: 'include', // to send cookies
        });
        // Option 1: Navigate within SPA
        navigate('/login');

        // Option 2: Full page reload (uncomment if you want this)
        // window.location.href = '/login';
      } catch (err) {
        console.error('Logout failed:', err);
      }
    };

    doLogout();
  }, [navigate]);

  return <h2>Logging out...</h2>;
}

export default Logout;