import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import AuthContext from './contexts/index.jsx';
import useAuth from './hooks/index.jsx';
import LoginPage from './Login.jsx';
import Chat from './Chat.jsx';

function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
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
      <Router>
        <div>
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
        </div>
      </Router>
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
