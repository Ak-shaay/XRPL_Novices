import React from 'react';

const Footer = () => {
  return (
    <footer className="py-3 bg-dark mt-4">
      <ul className="nav justify-content-center border-bottom pb-3 mb-3">
        <li className="nav-item">
          <a href="/" className="nav-link px-2 text-white">Home</a>
        </li>
        <li className="nav-item">
          <a href="/privacy" className="nav-link px-2 text-white">Privacy and Policy</a>
        </li>
        <li className="nav-item">
          <a href="/faq" className="nav-link px-2 text-white">FAQs</a>
        </li>
        <li className="nav-item">
          <a href="/about" className="nav-link px-2 text-white">About</a>
        </li>
      </ul>
      <p className="text-center text-white mb-0">© 2024 CDAC</p>
    </footer>
  );
};

export default Footer;
