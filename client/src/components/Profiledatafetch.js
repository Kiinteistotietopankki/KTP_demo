import { useEffect } from 'react';
import config from '../devprodConfig';
function Profiledata({ setUserData }) {
  const API_URL = config.apiBaseUrl;
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include', // ✅ include the session cookie in the request
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      console.log('✅ User Profile Data:', data);
      setUserData(data);
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return null;
}

export default Profiledata;
