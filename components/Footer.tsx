import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="contact">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo-text">
              Centre for <span>Peace Praxis</span>
            </div>
            <p id="footer-desc">
              Building communities of hope, healing, and resilience through peace literacy and intercultural dialogue.
            </p>
            <div className="social-links">
              <a
                href="https://www.instagram.com/centreforpeacepraxis?igsh=MXdqNnhoMzM5eWZ4dQ=="
                target="_blank"
                rel="noopener noreferrer"
                id="footer-instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/company/centre-for-peace-praxis/"
                target="_blank"
                rel="noopener noreferrer"
                id="footer-linkedin"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link href="/#home" id="footer-link-1">Home</Link>
              </li>
              <li>
                <Link href="/#about" id="footer-link-2">About Us</Link>
              </li>
              <li>
                <Link href="/#pillars" id="footer-link-3">Our Pillars</Link>
              </li>
              <li>
                <Link href="/#workshops" id="footer-link-4">Workshops</Link>
              </li>
              <li>
                <Link href="/#volunteer" id="footer-link-5">Volunteer</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact Info</h3>
            <ul>
              <li>
                <FaMapMarkerAlt />
                <a href="https://www.christuniversity.in/" target="_blank" rel="noopener noreferrer" id="footer-address">
                  {" "}CHRIST University
                </a>
              </li>
              <li>
                <FaPhone /> <span id="footer-phone">080 4012 9361</span>
              </li>
              <li>
                <FaEnvelope />
                <a href="mailto:peace.praxis@christuniversity.in" target="_blank" rel="noopener noreferrer" id="footer-email">
                  peace.praxis@christuniversity.in
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Our Partners</h3>
            <ul>
              <li>Educational Institutions</li>
              <li>Civil Society Groups</li>
              <li>Government Bodies</li>
              <li>International Partners</li>
            </ul>
          </div>
        </div>

        {/* Admin Login Link */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/login" style={{ color: "#666", fontSize: "0.8rem", textDecoration: "none", opacity: 0.5 }}>
            Admin Login
          </Link>
        </div>

        <div className="footer-logo-wrapper">
          <Image 
            src="/CHRIST_LOGO1.png" 
            alt="CHRIST Logo" 
            className="christ-logo" 
            width={300} 
            height={122} 
            style={{ height: 'auto', maxHeight: '122px', width: 'auto' }}
          />
        </div>

        <div className="copyright">
          <p>
            &copy; 2023 Centre for Peace Praxis. All rights reserved. |{" "}
            <FaHeart style={{ color: "#e76f51", display: 'inline' }} /> for peacebuilding
          </p>
        </div>
      </div>
    </footer>
  );
}
