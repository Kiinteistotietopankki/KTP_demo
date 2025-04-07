// src/components/Sidebar.js
import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import './Sidebar.css';  // Optional CSS for styling the sidebar


function Sidebar() {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
 
  const isAuthenticated = accounts.length > 0;
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        
        {!isAuthenticated ? (
         <li><Link to="/login">Login</Link></li>
        ): (
          <li><Link to="/logout">Logout</Link></li> 
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
