import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Nav from './components/header/Nav';
import Home from './components/pages/Home';
import Specific from './components/pages/Specific';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Logout from './components/pages/Logout';
import Profile from './components/pages/Profile';
import 'react-datepicker/dist/react-datepicker.css';

// Create a ProtectedRoute component
const ProtectedRoute = ({ user, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      user ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    // Clear user data and token when logging out
    setUser(null);
    localStorage.removeItem('accessToken'); // Remove the token from localStorage
    localStorage.removeItem('userData'); // Remove any other user data from localStorage
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Nav user={user} />
        {user ? (
          <Logout onLogout={handleLogout} />
        ) : null}
        <Switch>
          <Route exact path="/">
            <Home user={user} />
          </Route>
          <Route path="/specific/:id">
            <Specific />
          </Route>
          <Route path="/login">
            {user ? <Redirect to="/" /> : <Login onLogin={handleLogin} />}
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          {/* Use the ProtectedRoute component for the Profile route */}
          <ProtectedRoute
            path="/profile"
            user={user}
            component={Profile}
          />
        </Switch>
        <footer>Store footer</footer>
      </BrowserRouter>
    </div>
  );
}

export default App;






