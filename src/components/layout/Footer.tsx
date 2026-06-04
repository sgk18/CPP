import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Heart } from "lucide-react";
import { Instagram, Linkedin } from "@/components/ui/BrandIcons";

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="relative bg-dark text-white pt-20 pb-8 overflow-hidden">
      {/* Accent Top Border Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent via-secondary to-primary" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <div className="font-serif text-2xl font-bold tracking-tight">
            Centre for <span className="text-secondary">Peace Praxis</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Building communities of hope, healing, and resilience through peace literacy and intercultural dialogue.
          </p>
          {/* Social Links */}
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://www.instagram.com/centreforpeacepraxis?igsh=MXdqNnhoMzM5eWZ4dQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-accent hover:border-accent hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              aria-label="Instagram Profile"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/centre-for-peace-praxis/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-accent hover:border-accent hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              aria-label="LinkedIn Page"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-[16px] uppercase tracking-wider font-semibold font-display mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-secondary">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-3 list-none p-0 m-0">
            <li>
              <Link href="/#home" className="text-white/70 hover:text-secondary text-sm transition-all hover:translate-x-1 inline-block">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-white/70 hover:text-secondary text-sm transition-all hover:translate-x-1 inline-block">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/#pillars" className="text-white/70 hover:text-secondary text-sm transition-all hover:translate-x-1 inline-block">
                Our Pillars
              </Link>
            </li>
            <li>
              <Link href="/#workshops" className="text-white/70 hover:text-secondary text-sm transition-all hover:translate-x-1 inline-block">
                Workshops
              </Link>
            </li>
            <li>
              <Link href="/#volunteer" className="text-white/70 hover:text-secondary text-sm transition-all hover:translate-x-1 inline-block">
                Volunteer
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white text-[16px] uppercase tracking-wider font-semibold font-display mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-secondary">
            Contact Info
          </h3>
          <ul className="flex flex-col gap-4 list-none p-0 m-0">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <a
                href="https://www.christuniversity.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-secondary text-sm transition-colors"
              >
                CHRIST (Deemed to be University)
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
              <span className="text-white/70 text-sm">080 4012 9361</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
              <a
                href="mailto:peace.praxis@christuniversity.in"
                className="text-white/70 hover:text-secondary text-sm transition-colors break-all"
              >
                peace.praxis@christuniversity.in
              </a>
            </li>
          </ul>
        </div>

        {/* Partners */}
        <div>
          <h3 className="text-white text-[16px] uppercase tracking-wider font-semibold font-display mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-secondary">
            Our Partners
          </h3>
          <ul className="flex flex-col gap-3 list-none p-0 m-0 text-white/70 text-sm">
            <li>Educational Institutions</li>
            <li>Civil Society Groups</li>
            <li>Government Bodies</li>
            <li>International Partners</li>
          </ul>
        </div>
      </div>

      {/* Brand Logos and Sub-Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
        {/* Christ Logo */}
        <div className="flex justify-center items-center">
          <img
            src="/assets/CHRIST_LOGO1.png"
            alt="CHRIST Deemed to be University Logo"
            className="h-20 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Centre for Peace Praxis. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-accent fill-accent animate-pulse" />
            <span>for peacebuilding</span>
          </div>
          {/* Admin Login Link */}
          <div>
            <Link
              href="/login"
              className="text-white/20 hover:text-white/40 text-xs transition-colors duration-200"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
