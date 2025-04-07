import React, { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react'

function Profile() {
    const { accounts } = useMsal();
    const [userData, setUserData] = useState(null); // To store the fetched user data

    const userName = accounts.length > 0 ? accounts[0].name : 'vieras';
  
    const fetchMicrosoftUserData = async () => {
      const token = localStorage.getItem('accessToken'); 
  
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
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    useEffect(() => {
      fetchMicrosoftUserData();
    }, []);
  

  return (
    <div className="Profile-page">
      <h2>Tervetuloa, {userName}</h2>
      
      {userData && (
        <div>
          <h3>Käyttäjätiedot</h3>
          <p><strong>Nimi:</strong> {userData.displayName}</p>
          <p><strong>sähköposti: </strong> {userData.mail || 'Ei sähköpostia'}</p>
          <p><strong>Puh.num:</strong> {userData.mobilePhone || 'Ei puhelinnumeroa'}</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
