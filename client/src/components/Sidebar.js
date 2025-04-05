import { Navbar, Nav } from 'react-bootstrap';  // Importing the necessary Bootstrap components
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
                <Navbar.Brand as={Link} to="/" className="mb-4">Demo</Navbar.Brand>
                <Nav className="nav-names">
                    <Nav.Link as={Link} to="/" className="nav-item">Home</Nav.Link>
                    <Nav.Link as={Link} to="/about" className="nav-item">About</Nav.Link>
                    <Nav.Link as={Link} to="/services" className="nav-item">Services</Nav.Link>
                    <Nav.Link as={Link} to="/contact" className="nav-item">Contact</Nav.Link>
                </Nav>
        </Navbar>
  );
}

export default Sidebar;