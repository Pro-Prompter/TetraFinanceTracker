import React, { useState, useEffect } from "react";
import { Button, Form, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login as loginThunk, signup as signupThunk } from "../lib/redux/authSlice";
import { databases } from '../lib/appwrite'; // Import the databases API
import "../App.css";

const Auth = ({ mode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  // Function to generate a dynamic gradient
  const generateDynamicGradient = () => {
    const colors = Array.from({ length: 3 }, () => `hsl(${Math.random() * 360}, 100%, 50%)`);
    return `linear-gradient(${Math.random() * 360}deg, ${colors.join(", ")})`;
  };

  // Set an interval to change the gradient every few seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      document.body.style.background = generateDynamicGradient();
    }, 5000); // Change gradient every 5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];

    try {
      if (mode === "login") {
        await dispatch(loginThunk({ email, password }));
      } else if (mode === "signup") {
        const signupResult = await dispatch(signupThunk({ email, password, name: username }));

        if (signupResult.meta.requestStatus === 'fulfilled') {
          const documentData = {
            User_Name: username,
            Name: username,
            Role: "User"
          };

          await databases.createDocument(
            '66ae058300333732f99a',
            '66ae05a1002d7b4e35f7',
            'unique()',
            documentData
          );
        }
      }
    } catch (err) {
      setErrors([err.message || "An error occurred. Please try again."]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
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
          <h2 className="text-center mb-4">{mode === "login" ? "Login" : "Signup"}</h2>
          <Form onSubmit={handleSubmit} className="auth-form">
            {errors.length > 0 && (
              <Alert variant="danger">
                {errors.map((err, index) => (
                  <div key={index}>{err}</div>
                ))}
              </Alert>
            )}
            {mode === "signup" && (
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors([]);
                  }}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors([]);
                }}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors([]);
                }}
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={status === "loading"}
              className="btn-shine-blue w-100 my-4"
            >
              {status === "loading" ? <Spinner animation="border" /> : (mode === "login" ? "Login" : "Signup")}
            </Button>
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