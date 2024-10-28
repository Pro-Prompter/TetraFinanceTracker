import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FaCog, FaUsers, FaUserCircle } from "react-icons/fa";
import { logout } from "../lib/redux/authSlice";
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
            Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/clients" className="nav-item">
            Clients
          </Nav.Link>
          <Nav.Link as={Link} to="/transactions" className="nav-item">
            Transactions
          </Nav.Link>

          <Nav.Link as={Link} to="/team-commissions" className="nav-item">
            Commissions
          </Nav.Link>
        </Nav>
        <Nav className="ml-auto">
          <NavDropdown
            title={<FaUserCircle size={24} />}
            id="user-dropdown"
            align="end"
            className="user-dropdown"
          >
            
            <NavDropdown.Item as={Link} to="/users">
              <FaUsers className="mr-2" /> Users
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/settings">
              <FaCog className="mr-2" /> Settings
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
