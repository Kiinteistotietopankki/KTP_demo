// import { Navbar, Nav } from 'react-bootstrap';  // Importing the necessary Bootstrap components
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom';
import '../App.css';

function Sidebar() {
  return (
        <Navbar
            bg="dark"
            data-bs-theme="dark"
            className="sidebar"
            // expand="lg"
        >

                <Nav className="flex-sm-column flex-row">
                    <Nav.Link as={Link} to="/" className="nav-item">Home</Nav.Link>
                    <Nav.Link as={Link} to="/about" className="nav-item">About</Nav.Link>
                    <Nav.Link as={Link} to="/services" className="nav-item">Services</Nav.Link>
                    <Nav.Link as={Link} to="/contact" className="nav-item">Contact</Nav.Link>
                </Nav>
        </Navbar>
  );
}

export default Sidebar;