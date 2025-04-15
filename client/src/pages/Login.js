import React from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../Token';

function Login() {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 1. Login via popup
      const loginResponse = await instance.loginPopup({
        scopes: ['user.read'],
      });

      console.log("User logged in");

      // 2. Attempt to acquire token silently
      let tokenResponse;
      try {
        tokenResponse = await instance.acquireTokenSilent({
          scopes: ['user.read'],
          account: loginResponse.account,
        });
        console.log('Token acquired silently');
      } catch (error) {
        console.error('Silent token acquisition failed, trying interactive login', error);
        
        
        tokenResponse = await instance.acquireTokenPopup({
          scopes: ['user.read'],
        });
        console.log('Token acquired via popup');
      }

      
      saveToken(tokenResponse.accessToken);
      console.log('Token stored in localStorage');

      // 4. Navigate to the homepage or the protected page
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
