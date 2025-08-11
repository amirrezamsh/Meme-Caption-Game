import React, { useState } from "react";
// react components
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// context
import { useAuth } from "../../contexts/AuthContext";
// API
import { logoutAPI } from "../../API/API";

import "./navbar.css";

function NavBar() {
  const { username, loginUser } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleclick = async () => {
    const response = await logoutAPI();
    if (response.status === "successful") {
      loginUser({});
      navigate("/");
    } else if (response.status === "fail") {
      setError(response.message);
    }
  };

  return (
    <Navbar expand="xlg" fixed="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Game
        </Navbar.Brand>
        <Nav className="ml-auto">
          {!username && (
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          )}
        </Nav>
        {username && (
          <NavDropdown
            title={username}
            id="basic-nav-dropdown"
            className="ml-auto"
          >
            <NavDropdown.Item as={Link} to="/profile">
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleclick}>Logout</NavDropdown.Item>
          </NavDropdown>
        )}
      </Container>
    </Navbar>
  );
}

export default NavBar;
