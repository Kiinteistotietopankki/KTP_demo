// src/App.js
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';
import Home from './pages/Home';
import { useEffect } from 'react';

function App() {
  return (
    <Router>
      <ScrollToTop />

      <div className="layout">
        <Sidebar />
        
        <div className="app-container">
          
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
        </div>
      </div>
    </Router>
  );
}


function ScrollToTop() {
  const location = useLocation(); // Access the current route

  // Scroll to top when the location changes (i.e., route changes)
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top of the page
  }, [location]); // Trigger when the route changes

  return null; // This component does not need to render anything
}


function About() {
  return <h2>About Page</h2>;
}

function Services() {
  return <h2>Services Page</h2>;
}

function Contact() {
  return <h2>Contact Page</h2>;
}

export default App;
