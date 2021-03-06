import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Button, Form, Card, Container, Row,
} from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useAuth from './hooks/index.jsx';

const validationSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

function SignInForm() {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useHistory();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const res = await axios.post('/api/v1/login', values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        const from = location.state?.from?.pathname || '/';
        navigate.push(from);
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
      }
    },
  });

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Card>
          <Card.Body className="text-center">
            <Card.Title className="mb-4">Войти в чат</Card.Title>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label" htmlFor="username">
                  Ваш ник
                  <Form.Control
                    ref={inputRef}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    isInvalid={formik.errors.username && formik.touched.username}
                    id="username"
                    type="text"
                    name="username"
                    autoComplete="username"
                    required
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
                </Form.Label>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="form-label" htmlFor="password">
                  Пароль
                  <Form.Control
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    isInvalid={formik.errors.password && formik.touched.password}
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    id="password"
                    required
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                </Form.Label>
              </Form.Group>
              {authFailed && (
                <div className="invalid-feedback d-block">the username or password is incorrect</div>
              )}
              <Button type="submit" variant="outline-primary">Войти</Button>
            </Form>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
}

function LoginPage() {
  return (
    <div className="d-flex flex-column h-100">
      <div>
        <SignInForm />
      </div>
    </div>
  );
}

export default LoginPage;
