import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
await fetch('http://localhost:3001/auth/logout', {
  method: 'GET',
  credentials: 'include',
});

navigate('/login'); 
      } catch (err) {
        console.error('Logout failed:', err);
      }
    };

    doLogout();
  }, [navigate]);

  return <h2>Logging out...</h2>;
}

export default Logout;
