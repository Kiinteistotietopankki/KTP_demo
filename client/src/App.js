// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';
import Home from './pages/Home';

function App() {
  return (
    <Router>
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
