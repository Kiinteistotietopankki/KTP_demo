// import { Navbar, Nav } from 'react-bootstrap';  // Importing the necessary Bootstrap components
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import '../App.css';


function Sidebar() {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
 
  const isAuthenticated = accounts.length > 0;
  return (
        <Navbar
            bg="dark"
            data-bs-theme="dark"
            className="sidebar"
            // expand="lg"
        >

                <Nav className="flex-md-column flex-row">
                    <Nav.Link as={Link} to="/" className="nav-item">Home</Nav.Link>
                    <Nav.Link as={Link} to="/about" className="nav-item">About</Nav.Link>
                    <Nav.Link as={Link} to="/services" className="nav-item">Services</Nav.Link>
                    <Nav.Link as={Link} to="/contact" className="nav-item">Contact</Nav.Link>
                    <Nav.Link as={Link} to="/Profile" className="nav-item">Profile</Nav.Link>
                </Nav>
                {!isAuthenticated ? (
         <li><Link to="/login">Login</Link></li>
        ): (
          <li><Link to="/logout">Logout</Link></li> 
        )}
        </Navbar>
  );
}

export default Sidebar;