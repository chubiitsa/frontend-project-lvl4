import { useHistory } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import React from 'react';
import useAuth from './hooks/index.jsx';

export default function AuthStatus() {
  const auth = useAuth();
  const navigate = useHistory();
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (!auth.loggedIn) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light">
        <Container>
          <div className="pb-2">You are not logged in.</div>
        </Container>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <Container>
        <div>
          Welcome,
          {`  ${userId.username}`}
          !
        </div>
        <Button
          onClick={() => {
            auth.logOut(() => navigate('/'));
          }}
        >
          Sign out
        </Button>
      </Container>
    </nav>
  );
}
