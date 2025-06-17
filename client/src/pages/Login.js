import React from 'react';

function Login() {
  const handleLogin = () => {
   
    window.location.href = 'http://localhost:3001/auth/login';
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Kirjaudu sisään Microsoft-tililläsi</button>
    </div>
  );
}

export default Login;
