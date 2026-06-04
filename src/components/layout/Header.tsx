"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const navLinks = [
    { label: "Home", href: pathname === "/" ? "#home" : "/" },
    { label: "About", href: "/about" },
    { label: "Activities", href: pathname === "/" ? "#activities" : "/#activities" },
    { label: "Volunteer", href: pathname === "/" ? "#volunteer" : "/#volunteer" },
    { label: "Gallery", href: "/gallery" }
  ];

  const communityLinks = [
    { label: "Faculties", href: "/community/faculties" },
    { label: "Students", href: "/community/students" },
    { label: "Alumni", href: "/community/alumni" }
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith("#") || href.startsWith("/#")) {
      const elementId = href.split("#")[1];
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-black/5 ${
        isScrolled ? "py-3 bg-white/95 shadow-md shadow-black/[0.03] backdrop-blur-md" : "py-5 bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 group">
          <div className="w-14 h-14 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <img
              src="/assets/current_logo.png"
              alt="Centre for Peace Praxis Logo"
              className="object-contain w-full h-full"
            />
          </div>
          <div className="font-serif text-2xl font-bold tracking-tight text-dark transition-colors duration-300">
            Centre for <span className="text-primary">Peace Praxis</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 list-none p-0 m-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={`relative font-display text-[13px] font-semibold tracking-wider uppercase transition-colors duration-300 py-1.5 ${
                    isLinkActive(link.href)
                      ? "text-primary after:scale-x-100"
                      : "text-dark/85 hover:text-primary after:scale-x-0"
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:origin-center after:transition-transform after:duration-300`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Dropdown Community */}
            <li className="relative group/dropdown">
              <button
                className={`flex items-center gap-1 font-display text-[13px] font-semibold tracking-wider uppercase py-1.5 transition-colors duration-300 cursor-pointer ${
                  pathname.startsWith("/community") ? "text-primary" : "text-dark/85 hover:text-primary"
                }`}
                aria-haspopup="true"
                aria-expanded="false"
              >
                Community <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover/dropdown:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-black/5 shadow-xl shadow-black/[0.08] rounded-2xl overflow-hidden hidden group-hover/dropdown:block animate-fade-in-up origin-top-left">
                <div className="h-1 bg-accent w-full" />
                <ul className="list-none p-1 m-0">
                  {communityLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={`block px-5 py-3 text-[14px] font-medium text-dark transition-colors duration-200 hover:bg-light/60 hover:text-primary ${
                          pathname === link.href ? "bg-light/40 text-primary font-semibold" : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li>
              <Link
                href={pathname === "/" ? "#contact" : "/#contact"}
                onClick={() => handleLinkClick(pathname === "/" ? "#contact" : "/#contact")}
                className="font-display text-[13px] font-semibold tracking-wider uppercase py-1.5 text-dark/85 hover:text-primary transition-colors duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-primary hover:bg-light/60 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <div
        className={`fixed top-[97px] right-0 bottom-0 w-72 bg-white border-l border-black/5 shadow-2xl z-40 transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 gap-6 h-full overflow-y-auto">
          <ul className="flex flex-col gap-4 list-none p-0 m-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => {
                    handleLinkClick(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block py-2 font-display text-sm font-semibold tracking-wider uppercase transition-colors ${
                    isLinkActive(link.href) ? "text-primary border-l-4 border-accent pl-3" : "text-dark hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Mobile Community Submenu */}
            <li className="pt-2 border-t border-black/5">
              <span className="block text-xs font-bold text-gray-text uppercase tracking-widest mb-3">Community</span>
              <ul className="flex flex-col gap-2 pl-3 list-none p-0 m-0">
                {communityLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-1.5 text-sm font-medium text-dark transition-colors ${
                        pathname === link.href ? "text-primary font-semibold" : "hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="pt-2 border-t border-black/5">
              <Link
                href={pathname === "/" ? "#contact" : "/#contact"}
                onClick={() => {
                  handleLinkClick(pathname === "/" ? "#contact" : "/#contact");
                  setIsMobileMenuOpen(false);
                }}
                className="block py-2 font-display text-sm font-semibold tracking-wider uppercase text-dark hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
