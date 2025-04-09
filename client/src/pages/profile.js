import React, { useEffect, useState } from 'react';
import Profiledata from '../components/Profiledatafetch';
import '../App.css';
function Profile() {
  const [userData, setUserData] = useState(null); // To store the fetched user data

  return (
    <div className="profile-container">
    <Profiledata setUserData={setUserData} />

    
    {userData && (
      <div className="profile-card">
        <h3>Käyttäjätiedot</h3>
        <div className="profile-info">
          <p><strong>Nimi:</strong> {userData.displayName}</p>
          <p><strong>Sähköposti:</strong> {userData.mail || 'Ei sähköpostia'}</p>
          <p><strong>Puh.num:</strong> {userData.mobilePhone || 'Ei puhelinnumeroa'}</p>
        </div>
      </div>
    )}
  </div>
);
}

export default Profile;