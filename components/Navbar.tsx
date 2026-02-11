"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes, FaCaretDown } from "react-icons/fa";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Sticky Header Effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ScrollSpy Effect
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = document.querySelectorAll("section");
      
      let current = "home";
      
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          const id = section.getAttribute("id");
          if (id) current = id;
        }
      });
      
      setActiveSection(current);
    };
    
    window.addEventListener("scroll", handleScrollSpy);
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/#home", id: "home" },
    { name: "About", href: "/#about", id: "about" },
    { name: "Workshops", href: "/#workshops", id: "workshops" },
    { name: "Volunteer", href: "/#volunteer", id: "volunteer" },
    { name: "Gallery", href: "/gallery", id: "gallery-page" }, // Use different ID to avoid conflict or handle separately
  ];

  return (
    <header id="header" className={`${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <Link href="/#home" className="logo" onClick={closeMobileMenu}>
          <div className="logo-img">
            {/* Using Next.js Image component */}
            <Image 
              src="/current_logo.png" 
              alt="CPP Logo" 
              id="header-logo-img" 
              width={75} 
              height={75} 
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="logo-text" id="header-logo-text">
            Centre for <span>Peace Praxis</span>
          </div>
        </Link>

        <button 
          className="mobile-menu-btn" 
          id="mobileMenuBtn" 
          onClick={toggleMobileMenu}
          style={{ color: mobileMenuOpen ? "var(--dark)" : "var(--primary)" }}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav id="mainNav" className={mobileMenuOpen ? "active" : ""}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className={activeSection === link.id ? "active" : ""}
                  onClick={closeMobileMenu}
                  id={`nav-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            
            <li className="dropdown">
              <span className="dropbtn" id="nav-community" style={{ cursor: 'pointer', fontWeight: 600, fontSize: '15px', textTransform: 'uppercase' }}>
                Community <FaCaretDown style={{ display: 'inline', marginLeft: '5px' }} />
              </span>
              <div className="dropdown-content">
                <Link href="/faculties" id="nav-faculties" onClick={closeMobileMenu}>Faculties</Link>
                <Link href="/students" id="nav-students" onClick={closeMobileMenu}>Students</Link>
                <Link href="/alumni" id="nav-alumni" onClick={closeMobileMenu}>Alumni</Link>
              </div>
            </li>

            <li>
              <Link href="/#contact" className={activeSection === "contact" ? "active" : ""} onClick={closeMobileMenu} id="nav-contact">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
