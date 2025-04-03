import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login'; // Import Login page
import Logout from './pages/Logout';
import { config } from './Config';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: config.appId,
    authority: config.authority,
    redirectUri: config.redirectUri,
  },
});

// suojattu reitti
function ProtectedRoute({ children }) {
  const { accounts } = useMsal();
  return accounts.length > 0 ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />

              
              <Route
                path="/*"
                element={
                  <ProtectedRoute> {/* Suojaus reitelle. pääsee käsiksi kun kirjautuu sisään */}
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/logout" element={<Logout />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </MsalProvider>
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
