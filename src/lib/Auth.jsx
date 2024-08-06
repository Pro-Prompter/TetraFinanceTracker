import React, { useState } from 'react';
import { Button, Form, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { login, signup, checkAuth } from '../lib/redux/authSlice'; // Correct path
import { useDispatch, useSelector } from 'react-redux';

const Auth = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      await dispatch(login({ email, password }));
    } else if (mode === 'signup') {
      await dispatch(signup({ email, password }));
    }
  };

  if (isAuthenticated) {
    navigate('/');
  }

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <Button variant="primary" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? <Spinner animation="border" /> : mode === 'login' ? 'Login' : 'Signup'}
            </Button>
            {error && <Alert variant="danger">{error}</Alert>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Auth;