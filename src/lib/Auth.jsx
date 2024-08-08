import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Alert,
  Spinner,
  Container,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginThunk, signup as signupThunk } from '../lib/redux/authSlice';
import "../App.css";

const Auth = ({ mode }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      await dispatch(loginThunk({ email: emailOrUsername, password }));
    } else if (mode === 'signup') {
      await dispatch(signupThunk({ email: emailOrUsername, password, username }));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`auth-page ${theme}`}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="auth-card">
              <Card.Body>
                <button className="theme-toggle-btn" onClick={toggleTheme}>
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <h2 className="text-center mb-4">
                  {mode === 'login' ? 'Login' : 'Signup'}
                </h2>
                <Form onSubmit={handleSubmit}>
                  {mode === 'signup' && (
                    <Form.Group controlId="formBasicUsername">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Form.Group>
                  )}
                  <Form.Group controlId="formBasicEmailOrUsername">
                    <Form.Label>{mode === 'login' ? 'Email or Username' : 'Email'}</Form.Label>
                    <Form.Control
                      type={mode === 'login' ? 'text' : 'email'}
                      placeholder={mode === 'login' ? 'Enter email or username' : 'Enter email'}
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-block my-4"
                  >
                    {status === 'loading' ? <Spinner animation="border" /> : mode === 'login' ? 'Login' : 'Signup'}
                  </Button>
                  {error && <Alert variant="danger">{error}</Alert>}
                </Form>
                <div className="text-center mt-3">
                  {mode === 'login' ? (
                    <p>
                      New here?{' '}
                      <Button variant="link" onClick={() => navigate('/signup')}>
                        Sign up
                      </Button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{' '}
                      <Button variant="link" onClick={() => navigate('/login')}>
                        Login
                      </Button>
                    </p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auth;