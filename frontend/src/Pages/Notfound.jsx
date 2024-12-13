import React from "react";
import { useNavigate } from "react-router-dom";

const Notfound = () => {
    const navigate = useNavigate();

  return (
    <div className="bg-dark bg-gradient d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <div class="text-center text-white">
        <h1 class="display-1 fw-bold">404</h1>
        <p class="fs-3">
          {" "}
          <span class="text-danger">Opps!</span> Page not found.
        </p>
        <p class="lead">The page you’re looking for doesn’t exist.</p>
         <button
                type="button"
                className="btn btn-lg"
                style={{ backgroundColor: '#6c63ff', color: 'white' }}
                onClick={() => navigate("/")}
              >
                Go Home
              </button>
      </div>
    </div>
  );
};

export default Notfound;
