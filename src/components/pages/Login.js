import React, { useState, useEffect } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const API_BASE_URL = 'https://api.noroff.dev/api/v1/holidaze';

  useEffect(() => {
    // Check for an existing accessToken in local storage
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // If an accessToken is found, consider the user as logged in
      onLogin({ accessToken });
    }
  }, [onLogin]);

  async function loginUser(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const json = await response.json();
      const accessToken = json.accessToken;

      // Store the accessToken in local storage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('name', json.name);

    
      localStorage.setItem('userData', JSON.stringify(json));

      // Call the onLogin function with user data
      onLogin(json);

    } catch (error) {
      console.log(error);
    }
  }

  const handleLogin = () => {
    const userCredentials = {
      email: email,
      password: password,
    };

    loginUser(userCredentials);
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default Login;

