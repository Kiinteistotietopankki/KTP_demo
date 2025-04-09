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
  const accessToken = localStorage.getItem('accessToken')
  const isAuthenticated = !!accessToken;
  return (
        <Navbar
            bg="dark"
            data-bs-theme="dark"
            className="sidebar"
            // expand="lg"
        >

                <Nav className="flex-md-column flex-row">
                    <Nav.Link as={Link} to="/" className="nav-item">Haku</Nav.Link>
                    <Nav.Link as={Link} to="/about" className="nav-item">Ohjeet</Nav.Link>
                    <Nav.Link as={Link} to="/contact" className="nav-item">Ota yhteyttä</Nav.Link>
                    <Nav.Link as={Link} to="/Profile" className="nav-item">Omat tiedot</Nav.Link>
                
                 {/*!isAuthenticated ? (
          <Nav.Link as={Link} to="/login" className="nav-item">Login</Nav.Link>
        ): (
          <Nav.Link as={Link} to="/logout" className="nav-item">Logout</Nav.Link> 
        )*/}
                </Nav>
        </Navbar>
  );
}

export default Sidebar;