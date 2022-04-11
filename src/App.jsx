import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';

import LoginPage from './Login.jsx';
import Chat from './Chat.jsx';

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <PrivateRoute exact path="/">
            <Chat />
          </PrivateRoute>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function PrivateRoute() {
  return (
    <Route
      render={({ location }) => (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: location },
          }}
        />
      )}
    />
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
