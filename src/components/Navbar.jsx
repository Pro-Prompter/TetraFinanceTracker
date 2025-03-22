import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import { logout } from "../lib/redux/authSlice";
import { BiHomeAlt, BiMoney, BiLogOutCircle } from "react-icons/bi";
import "../App.css";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/login"); // Redirect to login after logout
    } catch (err) {
      console.error("Logout failed:", err);
      // Optionally handle logout failure (e.g., show an alert)
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="w-100">
      <Navbar.Brand as={Link} to="/">
        <img
          src="/assets/Tetra Studio Inverted.png"
          alt="Tetra Studio Logo"
          className="logo"
          height={100}
          width={40}
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/" className="nav-item">
            <BiHomeAlt /> Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/transactions" className="nav-item">
            <BiMoney /> Transactions
          </Nav.Link>
        </Nav>
        <Navbar.Text className="ml-auto">
          <Button variant="outline-danger" onClick={handleLogout}>
            <BiLogOutCircle /> Logout
          </Button>
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;