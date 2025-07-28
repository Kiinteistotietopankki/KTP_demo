
import logo from '../assets/images/waativalogo.png';
import { Container, Card, Button } from 'react-bootstrap';

function Login() {
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/login`;
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card
        className="p-4 shadow-sm border rounded d-flex flex-column justify-content-between"
        style={{ maxWidth: '400px', width: '100%', minHeight: '480px' }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="WAATIVA logo"
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
          />
          <h5 className="d-inline align-middle">WAATIVA</h5>
        </div>

        <div className="flex-grow-1 d-flex flex-column justify-content-center">
        <h5 className="text-center mb-4">Kirjaudu sisään</h5>
          <Button
            variant="outline-success"
            className="w-100 mb-3"
            onClick={handleLogin}
          >
          Microsoft-tilillä
          </Button>
          <Button
            variant="outline-success"
            className="w-100 mb-3"
            
          >
          Asiakastilillä
          </Button>

          <div className="text-center mt-2">
            <a
              href="https://support.microsoft.com/fi-fi/account-billing/en-voi-kirjautua-microsoft-tililleni-475c9b5c-8c25-49f1-9c2d-c64b7072e735"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted small"
            >
              Ongelmia kirjautumisessa?
            </a>
          </div>
        </div>

        <div className="text-center mt-4 text-muted" style={{ fontSize: '0.85rem' }}>
          © 2025 WAATIVA
        </div>
      </Card>
    </Container>
  );
}

export default Login;