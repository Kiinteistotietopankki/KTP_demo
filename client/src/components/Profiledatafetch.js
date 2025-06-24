import { useEffect } from 'react';

function Profiledata({ setUserData }) {
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:3001/me', {
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
