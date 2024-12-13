import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import axios from "axios";

const Redeem = () => {
  const { walletAddress } = useSelector((state) => state.user);
  const [redeemMethod, setRedeemMethod] = useState(""); // Track the selected redeem method
  const [currentXrpBalance, setCurrentXrpBalance] = useState(0); // Current XRP balance
  const [upiId, setUpiId] = useState("");
  const [secret, setSecret] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [redeemAmountInr, setRedeemAmountInr] = useState(0); // Store the converted INR value
  const [xrpToInrRate, setXrpToInrRate] = useState(196.4);
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [loading, setLoading] = useState(false); // Track loading state

  // Handle form input changes
  const handleUpiChange = (event) => setUpiId(event.target.value);
  const handleSecretChange = (event) => setSecret(event.target.value);
  const handleBankAccountChange = (event) => setBankAccount(event.target.value);
  const handleIfscCodeChange = (event) => setIfscCode(event.target.value);
  // const handleRedeemAmountChange = (event) => setRedeemAmount(event.target.value);
  const handleRedeemAmountChange = (event) => {
    const amount = event.target.value;
    setRedeemAmount(amount);
    setRedeemAmountInr(amount * xrpToInrRate); // Update INR value when XRP amount changes
  };

  // Handle radio button change
  const handleRedeemMethodChange = (event) => {
    setRedeemMethod(event.target.value);
  };

  // Fetch balance information
  const fetchBalance = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/xrpl/balance",
        { walletAddress }
      );
      if (response.status === 200) {
        setCurrentXrpBalance(response.data.balance);
      }
    } catch (err) {
      console.error("Error fetching the balance", err);
      setErrorMessage("Failed to fetch balance. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear the error after 3 seconds
    }
  };

  useEffect(() => {
    fetchBalance(walletAddress);
  }, []);

  // Redeem via UPI API call
  const redeemViaUpi = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/xrpl/redeem/upi",
        {
          walletAddress,
          secret,
          redeemAmount,
          upiId,
        }
      );

      if (response.status === 200) {
        setSuccessMessage(
          `You have successfully redeemed ${redeemAmount} XRP to your UPI ID: ${upiId}`
        );
        setCurrentXrpBalance(response.data.balance); // Update balance
        setRedeemAmount(0);
        setUpiId("");
        setTimeout(() => setSuccessMessage(""), 3000); // Clear the success message after 3 seconds
      }
      if (response.status === 201) {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
      }
    } catch (error) {
      console.error("Error during UPI redemption", error);
      setErrorMessage("Error redeeming via UPI. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
    } finally {
      setLoading(false); // Reset loading state after redeem attempt
    }
  };

  // Redeem via Bank API call
  const redeemViaBank = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/xrpl/redeem/bank",
        {
          walletAddress,
          redeemAmount,
          bankAccount,
          ifscCode,
          secret,
        }
      );

      if (response.status === 200) {
        setSuccessMessage(
          `You have successfully redeemed ${redeemAmount} XRP to your bank account`
        );
        setCurrentXrpBalance(response.data.balance); // Update balance
        setRedeemAmount(0);
        setUpiId("");
        setTimeout(() => setSuccessMessage(""), 3000); // Clear the success message after 3 seconds
      }
      if (response.status === 201) {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
      }
    } catch (error) {
      console.error("Error during bank redemption", error);
      setErrorMessage("Error redeeming via bank account. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
    } finally {
      setLoading(false); // Reset loading state after redeem attempt
    }
  };

  // Handle Redeem action
  // const handleRedeem = () => {
  //   setSuccessMessage(""); // Clear success message
  //   setErrorMessage(""); // Clear error message
  //   setLoading(true); // Set loading to true when the redeem action starts

  //   if (redeemAmount <= 0 || redeemAmount > currentXrpBalance) {
  //     setErrorMessage("Please enter a valid amount");
  //     setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
  //     setLoading(false); // Set loading to false after validation
  //   } else {
  //     if (redeemMethod === "upi") {
  //       redeemViaUpi(); // Call redeem via UPI API
  //     } else if (redeemMethod === "bank") {
  //       redeemViaBank(); // Call redeem via Bank API
  //     } else {
  //       setErrorMessage("Please select a redeem method");
  //       setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
  //       setLoading(false); // Set loading to false after validation
  //     }
  //   }
  // };
  const handleRedeem = () => {
    setSuccessMessage(""); // Clear success message
    setErrorMessage(""); // Clear error message
    setLoading(true); // Set loading to true when the redeem action starts

    // Field validation
    if (redeemAmount <= 0 || redeemAmount > currentXrpBalance) {
      setErrorMessage("Please enter a valid redeem amount.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
      setLoading(false); // Set loading to false after validation
      return;
    }

    if (redeemMethod === "upi") {
      if (!upiId) {
        setErrorMessage("UPI ID is required.");
        setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
        setLoading(false);
        return;
      }
      if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(upiId)) {
        setErrorMessage("Please enter a valid UPI ID.");
        setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
        setLoading(false);
        return;
      }
      if (!secret) {
        setErrorMessage("Secret key is required.");
        setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
        setLoading(false);
        return;
      }
      redeemViaUpi(); // Call redeem via UPI API
    } else if (redeemMethod === "bank") {
      if (!bankAccount) {
        setErrorMessage("Bank account number is required.");
        setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
        setLoading(false);
        return;
      }
      if (!/^\d+$/.test(bankAccount)) {
        setErrorMessage("Bank account number must be numeric.");
        setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
        setLoading(false);
        return;
      }
      if (!ifscCode) {
        setErrorMessage("IFSC code is required.");
        setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
        setLoading(false);
        return;
      }
      if (!/^[A-Z]{4}[0-9]{7}$/.test(ifscCode)) {
        setErrorMessage("Please enter a valid IFSC code.");
        setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
        setLoading(false);
        return;
      }
      if (!secret) {
        setErrorMessage("Secret key is required.");
        setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
        setLoading(false);
        return;
      }
      redeemViaBank(); // Call redeem via Bank API
    } else {
      setErrorMessage("Please select a redeem method.");
      setTimeout(() => setErrorMessage(""), 3000); // Clear the error message after 3 seconds
      setLoading(false); // Set loading to false after validation
    }
  };
  return (
    <div className="bg-dark bg-gradient d-flex flex-column min-vh-100">
      <Navbar />

      <div className="container d-flex flex-column align-items-center py-5">
        <h2 className="text-white mb-4">Choose Your Redeem Method</h2>
        <div className="mb-4 text-white">
          <h4>Your Current XRP Balance: {currentXrpBalance} XRP</h4>
        </div>

        <div className="mb-4 text-white">
          <label htmlFor="redeemAmount" className="form-label">
            Enter Redeem Amount:
          </label>
          <input
            type="number"
            id="redeemAmount"
            className="form-control"
            value={redeemAmount}
            onChange={handleRedeemAmountChange}
            placeholder="Amount to Redeem"
            min="1"
            max={currentXrpBalance - 20}
            step="1" // Enforcing integer values
          />
        </div>
        <div className="mb-4 text-white">
          <h4>Equivalent in INR: ₹{redeemAmountInr.toFixed(2)}</h4>
        </div>

        <div className="mb-4 text-white">
          <label className="form-label">Select Redeem Method:</label>
          <div className="form-check">
            <input
              type="radio"
              id="upi"
              name="redeemMethod"
              value="upi"
              checked={redeemMethod === "upi"}
              onChange={handleRedeemMethodChange}
              className="form-check-input"
            />
            <label htmlFor="upi" className="form-check-label ms-2">
              Redeem via UPI
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              id="bank"
              name="redeemMethod"
              value="bank"
              checked={redeemMethod === "bank"}
              onChange={handleRedeemMethodChange}
              className="form-check-input"
            />
            <label htmlFor="bank" className="form-check-label ms-2">
              Redeem via Bank
            </label>
          </div>
        </div>

        <div className="row">
          {redeemMethod === "upi" && (
            <div className="col">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Redeem via UPI</h5>
                  <p className="card-text">
                    Redeem your balance directly to your UPI ID for instant
                    transfers.
                  </p>
                  <div className="mt-3">
                    <label htmlFor="upiId" className="form-label">
                      Enter your UPI ID:
                    </label>
                    <input
                      type="text"
                      id="upiId"
                      className="form-control"
                      value={upiId}
                      onChange={handleUpiChange}
                      placeholder="example@upi"
                    />
                  </div>
                  <div className="mt-3">
                    <label htmlFor="secret" className="form-label">
                      Enter your Secret Key:
                    </label>
                    <input
                      type="password"
                      id="secret"
                      className="form-control"
                      value={secret}
                      onChange={handleSecretChange}
                      placeholder="Secret key"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {redeemMethod === "bank" && (
            <div className="col">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Redeem via Bank</h5>
                  <p className="card-text">
                    Redeem your balance to your bank account using your account
                    details.
                  </p>
                  <div className="mt-3">
                    <label htmlFor="bankAccount" className="form-label">
                      Enter Bank Account Number:
                    </label>
                    <input
                      type="text"
                      id="bankAccount"
                      className="form-control"
                      value={bankAccount}
                      onChange={handleBankAccountChange}
                      placeholder="Account Number"
                    />
                    <label htmlFor="ifscCode" className="form-label mt-2">
                      Enter IFSC Code:
                    </label>
                    <input
                      type="text"
                      id="ifscCode"
                      className="form-control"
                      value={ifscCode}
                      onChange={handleIfscCodeChange}
                      placeholder="IFSC Code"
                    />
                    <label htmlFor="secret" className="form-label mt-2">
                      Enter your Secret Key:
                    </label>
                    <input
                      type="password"
                      id="secret"
                      className="form-control"
                      value={secret}
                      onChange={handleSecretChange}
                      placeholder="Secret key"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error and Success messages */}
        {errorMessage && (
          <div className="alert alert-danger w-100 mb-3 mt-3">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success w-100 mb-3 mt-3">
            {successMessage}
          </div>
        )}

        <div className="mt-4">
          <button
            className="btn btn-warning"
            onClick={handleRedeem}
            disabled={loading} // Disable the button when loading
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Confirm Redeem"
            )}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Redeem;
