import React from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../Token';
function Login() {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      
      const loginResponse = await instance.loginPopup({
        scopes: ['user.read'], 
      });

      console.log("User logged in")
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ['user.read'],
        account: loginResponse.account,
      });

      // Save the token using the tokenStorage utility
      saveToken(tokenResponse.accessToken);

      console.log("Token stored in localStorage");
      navigate('/');
      
    } catch (error) {
      console.error('Login failed: ', error);
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Kirjaudu sisään Microsoft tililläsi</button>
    </div>
  );
}

export default Login;
