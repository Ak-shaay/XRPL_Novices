import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [validationErrors, setValidationErrors] = useState({});

  // Simple wallet address validation (assuming a basic format)
  const validateWalletAddress = (address) => {
    const regex = /^r[1-9A-HJ-NP-Za-km-z]{33}$/;
    return regex.test(address);
  }

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Validate form fields before submitting
  const validateForm = () => {
    let errors = {};
    if (!name) errors.name = "Username is required.";
    if (!walletAddress) errors.walletAddress = "Wallet address is required.";
    else if (!validateWalletAddress(walletAddress))
      errors.walletAddress = "Invalid wallet address format.";
    if (!password) errors.password = "Password is required.";
    else if (!validatePassword(password))
      errors.password = "Password must be at least 6 characters.";
    if (password !== passwordConfirm)
      errors.passwordConfirm = "Passwords do not match.";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const signupHandler = async () => {
    if (!validateForm()) return; // Prevent submission if validation fails

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/signup",
        {
          name: name,
          walletAddress: walletAddress,
          password: password,
          passwordConfirm: passwordConfirm,
        }
      );

      if (response.status === 200) {
        setIsLoading(false);
        setSuccessMessage("Account has been created successfully");
        setErrorMessage("");
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      setErrorMessage("Failed: " + err?.response?.data.message);
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="bg-dark bg-gradient d-flex flex-column min-vh-100">
      <Navbar />
      <div className="d-flex flex-column flex-grow-1 justify-content-center">
        <main className="d-flex justify-content-center">
          <form className="form-signin col-10 col-md-6 col-lg-4 my-4 text-white border border-light p-4 rounded">
            <h1 className="h3 mb-3 font-weight-normal text-center">Create account</h1>
            
            {/* Username Field */}
            <label htmlFor="inputUsername" className="d-flex justify-content-start mt-3">
              Username
            </label>
            <input
              type="text"
              id="inputUsername"
              className={`form-control mt-1 ${validationErrors.name ? 'is-invalid' : ''}`}
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            {validationErrors.name && (
              <div className="invalid-feedback">{validationErrors.name}</div>
            )}

            {/* Wallet Address Field */}
            <label htmlFor="inputWalletAddress" className="d-flex justify-content-start mt-3">
              Wallet Address
            </label>
            <input
              type="text"
              id="inputWalletAddress"
              className={`form-control mt-1 ${validationErrors.walletAddress ? 'is-invalid' : ''}`}
              placeholder="Enter your wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              required
            />
            {validationErrors.walletAddress && (
              <div className="invalid-feedback">{validationErrors.walletAddress}</div>
            )}

            {/* Password Field */}
            <label htmlFor="inputPassword" className="d-flex justify-content-start mt-3">
              Password
            </label>
            <input
              type="password"
              id="inputPassword"
              className={`form-control mt-1 ${validationErrors.password ? 'is-invalid' : ''}`}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {validationErrors.password && (
              <div className="invalid-feedback">{validationErrors.password}</div>
            )}

            {/* Confirm Password Field */}
            <label htmlFor="inputPasswordConfirm" className="d-flex justify-content-start mt-3">
              Confirm Password
            </label>
            <input
              type="password"
              id="inputPasswordConfirm"
              className={`form-control mt-1 ${validationErrors.passwordConfirm ? 'is-invalid' : ''}`}
              placeholder="Retype your password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
            {validationErrors.passwordConfirm && (
              <div className="invalid-feedback">{validationErrors.passwordConfirm}</div>
            )}

            {/* Success/Failure Message */}
            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {successMessage}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            <div className="mb-3 mt-3 d-flex justify-content-center">
              <button
                type="button"
                className="py-1 px-4 btn"
                style={{ backgroundColor: "#6c63ff", color: "white" }}
                onClick={signupHandler}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Sign up"}
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

export default Signup;
