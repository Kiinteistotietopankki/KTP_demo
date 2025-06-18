import React, {useState } from 'react';
import Profiledata from '../components/Profiledatafetch';
import '../App.css';
function Profile() {
  const [userData, setUserData] = useState(null);

  return (
    <div>
      <h1>Profile</h1>
      <Profiledata setUserData={setUserData} />

      {userData ? (
        <div>
          <p><strong>Name:</strong> {userData.displayName}</p>
          <p><strong>Email:</strong> {userData.mail || userData.userPrincipalName}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;
