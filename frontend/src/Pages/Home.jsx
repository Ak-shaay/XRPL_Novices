import React from 'react';
import child_labour from '../assests/preview.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-dark bg-gradient">
      <Navbar />
      <div className="blur-circle1"></div>
      <div className="blur-circle2"></div>
      <div className="d-flex flex-column "> {/*min-vh-80*/}
      <main className="flex-grow-1">
        <div className="container">
          <div className="row align-items-center" style={{ minHeight: 'calc(90vh - 80px)' }}>
            <div className="col-lg-6 text-white">
              <h1>Little hands need to play, not work.</h1>
              <p className="text-light" style={{ lineHeight: '1.6' }}>
                Child labour steals away the joy and innocence of childhood. Let's raise awareness, enforce laws,
                and create an environment where every child can thrive and reach their full potential.
              </p>
              <button
                type="button"
                className="btn btn-lg"
                style={{ backgroundColor: '#6c63ff', color: 'white' }}
                onClick={() => navigate("/report")}
              >
                Report Child Labour
              </button>
            </div>
            <div className="col-lg-6 text-center">
              <img
                className="img-fluid"
                src={child_labour}
                alt="Child labour image"
              />
            </div>
          </div>
        </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
