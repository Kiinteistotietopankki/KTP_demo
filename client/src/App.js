import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';

import Sidebar from './components/Sidebar';
import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './pages/profile';
import Taloyhtiokortti from './pages/Taloyhtiokortti';
import Taloyhtiokortit from './pages/Taloyhtiokortit';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="layout">
        <Sidebar />
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/taloyhtiokortit" element={<Taloyhtiokortit />} />
            <Route path="/taloyhtiokortti/:id" element={<Taloyhtiokortti />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function About() {
  const environment = process.env.REACT_APP_ENVIRONMENT || 'environment boolean not found';
  const apiurl = process.env.REACT_APP_PROD_API_URL || 'api url not found';

  return (
    <h2 className="text-primary">
      Ohjeet <Badge bg="secondary">Tulossa</Badge>
      <div className="mt-4">Production environment: {environment} - {apiurl}</div>
    </h2>
  );
}

function Contact() {
  return (
    <h2 className="text-primary">
      Ota yhteyttä <Badge bg="secondary">Tulossa</Badge>
    </h2>
  );
}

export default App;
