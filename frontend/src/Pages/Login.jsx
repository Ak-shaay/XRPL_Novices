import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    password: "",
  });

  const validateFields = () => {
    const errors = { name: "", password: "" };

    if (!name) {
      errors.name = "Username is required.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    setValidationErrors(errors);

    // If no validation errors, proceed with login
    return !errors.name && !errors.password;
  };

  const loginHandler = async () => {
    // Validate fields before attempting login
    if (!validateFields()) {
      return; // Stop the login attempt if validation fails
    }

    setIsLoading(true);
    setErrorMessage(""); // Reset error message

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          name: name,
          password: password,
        }
      );

      if (response.status === 200) {
        const { name, role ,walletAddress } = response.data.user;

        dispatch(setLoggedIn({ name, role, walletAddress }));

        if (role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/user");
        }
      } else {
        setErrorMessage(response.data.message || "Invalid login credentials");
        setMessageType("error");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred while logging in");
      setMessageType("error");
    } finally {
      setIsLoading(false);
      setPassword("");

      // Auto-hide error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("");
        setMessageType("");
      }, 3000);
    }
  };

  return (
    <div className="bg-dark bg-gradient d-flex flex-column min-vh-100">
      <Navbar />
      <div className="d-flex flex-column flex-grow-1 justify-content-center">
        <main className="d-flex justify-content-center">
          <form className="form-signin col-10 col-md-6 col-lg-4 my-4 text-white border border-light p-4 rounded">
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>

            <label htmlFor="inputUsername" className="d-flex justify-content-start mt-3">
              Username
            </label>
            <input
              type="text"
              id="inputUsername"
              className="form-control mt-1"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            {validationErrors.name && (
              <div className="text-danger mt-1">{validationErrors.name}</div>
            )}

            <label htmlFor="inputPassword" className="d-flex justify-content-start mt-3">
              Password
            </label>
            <input
              type="password"
              id="inputPassword"
              className="form-control mt-1"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {validationErrors.password && (
              <div className="text-danger mt-1">{validationErrors.password}</div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className={`alert alert-danger alert-sm my-3`} role="alert">
                {errorMessage}
              </div>
            )}

            <div className="mb-3 mt-3 d-flex justify-content-center gap-2">
              <button
                type="button"
                className="py-1 px-4 btn"
                style={{ backgroundColor: "#6c63ff", color: "white" }}
                onClick={loginHandler}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
              <button
                type="button"
                className="py-1 px-4 btn"
                style={{ backgroundColor: "#ff6347b8", color: "white" }} 
                onClick={() => navigate('/signup')}
                disabled={isLoading}
              >
                Sign up
              </button>
            </div>
          </form>
        </main>
        <div style={{ marginBottom: "3rem" }}>&nbsp;</div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
