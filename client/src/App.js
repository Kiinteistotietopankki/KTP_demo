import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login'; // Import Login page
import Logout from './pages/Logout';
import Profile from './pages/profile';
import { config } from './Config';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { useEffect } from 'react';

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
        <ScrollToTop />

      <div className="layout">
          <Sidebar />
          
        <div className="app-container">
            <Routes>
              <Route path="/login" element={<Login />} />

              
              <Route
                path="/*"
                element={
                  <ProtectedRoute> {/* Suojaus reitelle. pääsee käsiksi kun käyttäjä on kirjautunut sisään */}
                    
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
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
