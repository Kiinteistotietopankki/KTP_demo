import { useEffect } from 'react';

function Profiledata({ setUserData }) {
  const fetchMicrosoftUserData = async () => {
    const token = localStorage.getItem('accessToken'); // Or use cookie/session if backend handles auth

    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      console.log('User Profile Data:', data);
      setUserData(data); // Update parent component with fetched data
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchMicrosoftUserData();
  }, []);

  return null; // 👈 No UI here; only data fetching side-effect
}

export default Profiledata;
