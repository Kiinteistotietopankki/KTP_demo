import React, { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';

function Profiledata({ setUserData }) {
  const fetchMicrosoftUserData = async () => {
    const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      console.log('User Profile Data:', data);
      setUserData(data); // Updating user data in the parent component
      
    } catch (error) {
      console.error('Error fetching user data:', error);
     
    }
  };

  useEffect(() => {
    fetchMicrosoftUserData(); 
  }, []);

 
}

export default Profiledata;
