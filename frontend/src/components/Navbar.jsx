import React from "react";
import { useNavigate } from "react-router-dom";
import { setLoggedOut } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const { Auth, role } = useSelector((state) => state.user);  // Destructure role and Auth
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(setLoggedOut());
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          XRPL_Novices
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li> */}
            
            {/* Dashboard link appears second */}
            {Auth && (
              <>
                {role === "admin" && (
                  <li className="nav-item">
                    <a className="nav-link" href="/dashboard">
                      Dashboard
                    </a>
                  </li>
                )}
                {role === "user" && (
                  <>
                  <li className="nav-item">
                    <a className="nav-link" href="/user">
                      Dashboard
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/report">
                      Report
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/redeem">
                      Redeem
                    </a>
                  </li>
                  </>
                )}
              </>
            )}
            
            {/* Check Status link appears after Dashboard */}
            {Auth && (
              <li className="nav-item">
                <a className="nav-link" href="/status">
                  Check Status
                </a>
              </li>
            )}
            
            {/* <li className="nav-item">
              <a className="nav-link" href="/about">
                About us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/privacy">
                Privacy and Policies
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/faq">
                FAQs
              </a>
            </li> */}
            {Auth ? (
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={logoutHandler}
                  style={{ backgroundColor: "#6c63ff", color: "white" }}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate("/login")}
                  style={{ backgroundColor: "#6c63ff", color: "white" }}
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
