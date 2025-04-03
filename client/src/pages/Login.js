import React from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { instance } = useMsal();
  const navigate = useNavigate();

  // 
  const handleLogin = async () => {
    try {
      
      await instance.loginPopup({
        scopes: ['user.read'], 
      });

      
      navigate('/');
    } catch (error) {
      console.error('Login failed: ', error);
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Login with Microsoft</button>
    </div>
  );
}

export default Login;
