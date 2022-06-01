import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { io } from 'socket.io-client';
import AuthContext from './contexts/index.jsx';
import useAuth from './hooks/index.jsx';
import LoginPage from './Login.jsx';
import Chat from './Chat.jsx';
import AuthStatus from './AuthStatus.jsx';

function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const socket = io();

  const logIn = () => {
    setLoggedIn(true);
    socket.connect();
  };
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
    socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{
      loggedIn, logIn, logOut, socket,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.loggedIn) {
    return <Redirect to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column h-100">
        <AuthStatus />
        <Router>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/">
              <RequireAuth>
                <Chat />
              </RequireAuth>
            </Route>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </Router>
      </div>
    </AuthProvider>
  );
}

function NoMatch() {
  const location = useLocation();

  return (
    <div>
      <h3>
        Страница
        <code>{location.pathname}</code>
        не найдена!
      </h3>
    </div>
  );
}
