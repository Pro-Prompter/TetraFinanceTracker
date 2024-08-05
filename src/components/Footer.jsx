import React from "react";
import "../App.css"; // Import your existing App.css
import { FaTwitter, FaLinkedin, FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer_base">
      <div className="footer_content_wrap">
        <div className="footer_content_main">
          <div className="footer_center">
            <span>© Tetra Studio 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
