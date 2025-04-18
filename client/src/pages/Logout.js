import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        localStorage.removeItem('accessToken');
        localStorage.clear();
        sessionStorage.clear();
        await instance.logoutRedirect(); 
        // If using MSAL.js, clear the MSAL cache
        
        navigate('/login'); 
      } catch (error) {
        console.error('Logout failed: ', error);
      }
    };

    logout();
  }, [instance, navigate]);

  return <h2>Logging out</h2>;
}

export default Logout;
