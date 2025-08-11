import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// bootstrap components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import NavBar from "../navbar/navbar";
// API
import { loginAPI, signupAPI } from "../../API/API";
// styles
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernamesignup, setUsernamesignup] = useState("");
  const [passwordsignup, setPasswordsignup] = useState("");
  const [error, setError] = useState("");
  const [messageSignup, setMessageSignup] = useState("");
  const [signupStatus, setSignupStatus] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessageSignup("");

    const response = await loginAPI(username, password);
    if (response.status == "fail") {
      setError(response.message);
    } else {
      loginUser({ username: response.User.username });
      navigate("/");
    }
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    setMessageSignup("");
    setError("");
    const response = await signupAPI(usernamesignup, passwordsignup);

    setMessageSignup(response.message);
    setSignupStatus(response.status);
  };

  return (
    <>
      <NavBar />
      <div className="d-flex cc">
        <div className="container container-login">
          <h1>Login</h1>
          <hr className="mb-4" />
          <Form onSubmit={handleSubmit}>
            <Form.Control
              className="mb-3"
              size="lg"
              type="text"
              placeholder="Username"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Form.Control
              size="lg"
              type="password"
              placeholder="Password"
              name="password"
              className="mb-4"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="d-flex justify-content-center">
              <Button variant="dark" size="lg" type="submit">
                Login
              </Button>
            </div>
          </Form>
          {error && (
            <Alert className="mt-3" variant="danger">
              {error}
            </Alert>
          )}
        </div>
        {/* signup */}
        <div className="container container-signup">
          <h1>Signup</h1>
          <hr className="mb-4" />
          <Form onSubmit={handleSubmitSignup}>
            <Form.Control
              className="mb-3"
              size="lg"
              type="text"
              placeholder="Username"
              name="username"
              onChange={(e) => setUsernamesignup(e.target.value)}
              required
            />
            <Form.Control
              size="lg"
              type="password"
              placeholder="Password"
              name="password"
              className="mb-4"
              onChange={(e) => setPasswordsignup(e.target.value)}
              required
            />
            <div className="d-flex justify-content-center">
              <Button variant="dark" size="lg" type="submit">
                Signup
              </Button>
            </div>
          </Form>
          {messageSignup && (
            <Alert
              className="mt-3"
              variant={signupStatus == "fail" ? "danger" : "success"}
            >
              {messageSignup}
            </Alert>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
