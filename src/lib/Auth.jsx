import React, { useState, useEffect } from "react";
import { Button, Form, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login as loginThunk } from "../lib/redux/authSlice";
import "../App.css";

const Auth = ({ mode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]); // Reset errors before each submit

    try {
      if (mode === "login") {
        await dispatch(loginThunk({ email, password }));
      }
    } catch (err) {
      setErrors([err.message || "An error occurred. Please try again."]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to home if authenticated
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setErrors([error]);
    }
  }, [error]);

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2> {/* Fixed to "Login" */}
          <Form onSubmit={handleSubmit} className="auth-form">
            {errors.length > 0 && (
              <Alert variant="danger">
                {errors.map((err, index) => (
                  <div key={index}>{err}</div>
                ))}
              </Alert>
            )}

            {/* Removed Signup Specific Form */}
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
              className="btn-shine-blue w-100 my-4"
            >
              {status === "loading" ? <Spinner animation="border" /> : "Login"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Auth;