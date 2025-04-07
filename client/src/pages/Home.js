import React, { useEffect, useState } from 'react';
import './Home.css';
import { useMsal } from '@azure/msal-react'

function Home() {
  
  const { accounts } = useMsal();

  
  const userName = accounts.length > 0 ? accounts[0].name : 'vieras';

  return (
    <div className="home-page">
      <h2>Kiinteistötietopankki</h2>
      <p>Tervetuloa, {userName}</p> 
      <button className="custom-button">Click Me</button>
    </div>
  );
}

export default Home;
