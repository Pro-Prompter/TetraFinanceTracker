import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, Button, Modal } from "react-bootstrap";
import { logout } from "../lib/redux/authSlice";
import { BiHomeAlt, BiMoney, BiLogOutCircle } from "react-icons/bi";
import "../App.css";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        fixed="top"
        className="custom-navbar py-3"
        style={{
          background: "linear-gradient(145deg, #1a1a1a, #2d2d2d)",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="container-fluid">
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src="/assets/Tetra Studio Inverted.png"
              alt="Tetra Studio Logo"
              className="logo hover-scale"
              height="50"
              width="auto"
              style={{
                transition: "transform 0.3s ease, filter 0.3s ease",
                filter: "grayscale(100%)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.filter = "grayscale(0%)")}
              onMouseOut={(e) => (e.currentTarget.style.filter = "grayscale(100%)")}
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-nav" className="custom-toggler" />

          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link
                as={Link}
                to="/"
                className="nav-item mx-3 hover-effect"
                style={{ transition: "all 0.3s ease" }}
              >
                <BiHomeAlt className="nav-icon" />
                <span className="ms-2">Dashboard</span>
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/transactions"
                className="nav-item mx-3 hover-effect"
                style={{ transition: "all 0.3s ease" }}
              >
                <BiMoney className="nav-icon" />
                <span className="ms-2">Transactions</span>
              </Nav.Link>
            </Nav>

            <div className="d-flex align-items-center">
              <Button
                variant="danger"
                onClick={() => setShowLogoutModal(true)}
                className="logout-btn px-4 py-2"
                style={{
                  borderRadius: "25px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <BiLogOutCircle className="me-2" />
                Logout
              </Button>
            </div>
          </Navbar.Collapse>
        </div>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
        style={{ borderRadius: "15px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowLogoutModal(false)}
            style={{
              borderRadius: "25px",
              fontWeight: "600",
              padding: "8px 16px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            style={{
              borderRadius: "25px",
              fontWeight: "600",
              padding: "8px 16px",
            }}
          >
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavigationBar;
