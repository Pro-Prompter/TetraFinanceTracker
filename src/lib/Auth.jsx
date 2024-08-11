import React, { useState, useEffect } from "react";
import { Button, Form, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login as loginThunk,
  signup as signupThunk,
} from "../lib/redux/authSlice";
import "../App.css";

const Auth = ({ mode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await dispatch(loginThunk({ email, password }));
      } else if (mode === "signup") {
        await dispatch(signupThunk({ email, password, name: username }));
      }
      navigate("/"); // Redirect after successful auth
    } catch (err) {
      console.error("Authentication failed:", err);
      // Handle error here if necessary
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect after successful auth
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Card.Body>
          <h2 className="text-center mb-4">
            {mode === "login" ? "Login" : "Signup"}
          </h2>
          <Form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
            )}
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={status === "loading"}
              className="btn-primary w-100 my-4"
            >
              {status === "loading" ? (
                <Spinner animation="border" />
              ) : mode === "login" ? (
                "Login"
              ) : (
                "Signup"
              )}
            </Button>
            {error && <Alert variant="danger">{error}</Alert>}
          </Form>
          <div className="text-center mt-3">
            {mode === "login" ? (
              <p>
                New here?{" "}
                <Button variant="link" onClick={() => navigate("/signup")}>
                  Sign up
                </Button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Button variant="link" onClick={() => navigate("/login")}>
                  Login
                </Button>
              </p>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Auth;