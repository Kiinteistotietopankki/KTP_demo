// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import './Sidebar.css';  // Optional CSS for styling the sidebar

function Sidebar() {
  const { instance } = useMsal();

  const handleLogout = async () => {
    await instance.logoutRedirect();
  };
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link onClick={handleLogout}>Logout</Link></li> 
      </ul>
    </div>
  );
}

export default Sidebar;
