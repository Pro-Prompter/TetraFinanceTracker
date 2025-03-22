import React, { useState, useEffect } from "react";
import { Button, Form, Alert, Spinner, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login as loginThunk } from "../lib/redux/authSlice";
import { FiArrowRightCircle, FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import "../App.css";

const Auth = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = [];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.push("Please enter a valid email");
    }
    if (formData.password.length < 8) {
      validationErrors.push("Password must be at least 8 characters");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await dispatch(loginThunk(formData));
    } catch (err) {
      setErrors([err.message || "Authentication failed. Please check credentials"]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-container">
      <div className="gradient-background">
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div className="particle" key={i} />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="d-flex justify-content-center align-items-center h-100"
      >
        <Card className="auth-card glassmorphism-effect">
          <Card.Body className="p-5">
            <div className="text-center mb-5">
              <div className="finance-icon mb-3">
                <div className="icon-circle">
                  <FiArrowRightCircle size={28} />
                </div>
              </div>
              <h2 className="text-gradient">Hello Syed Hasan Ahmed</h2>
              <p className="text-muted mt-2">Secure access to your Finances</p>
            </div>

            <Form onSubmit={handleSubmit}>
              {errors.length > 0 && (
                <Alert variant="danger" className="text-center py-2 mb-4">
                  {errors.map((err, i) => (
                    <div key={i}>⚠️ {err}</div>
                  ))}
                </Alert>
              )}

              <Form.Group className="mb-4">
                <div className="input-group-lg">
                  <div className="input-icon">
                  </div>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="abc@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="modern-input"
                    autoFocus
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="input-group-lg">
                  <div className="input-icon">
                  </div>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="modern-input"
                  />
                </div>
              </Form.Group>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="danger"
                  type="submit"
                  disabled={status === "loading"}
                  className="w-100 btn-finance"
                >
                  {status === "loading" ? (
                    <Spinner animation="border" size="sm" variant="light" />
                  ) : (
                    <>
                      Welcome to Tetra Finance <FiArrowRightCircle className="ms-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </Form>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;