'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10)
  }

  return (
    <>
      <script>
        {`
          if (typeof window !== 'undefined') {
            window.addEventListener('scroll', function() {
              const header = document.querySelector('header');
              if (window.scrollY > 10) {
                header?.classList.add('scrolled');
              } else {
                header?.classList.remove('scrolled');
              }
            });
          }
        `}
      </script>

      <header className="fixed top-0 w-full z-50 glass-effect smooth-transition">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex justify-between items-center py-4 smooth-transition">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-4 no-underline hover:no-underline group smooth-transition"
            >
              <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center overflow-hidden group-hover:rotate-10 smooth-transition">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <span className="text-2xl font-black text-primary">
                CPP<span className="text-secondary">.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex list-none gap-8">
                {['HOME', 'ABOUT', 'SERVICES', 'TEAM', 'CONTACT'].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="no-underline text-gray-800 font-semibold text-sm uppercase tracking-wider smooth-transition relative pb-1.5 hover:text-primary"
                        style={{
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                          const target = e.currentTarget
                          const before = target.querySelector('::before')
                          target.style.setProperty('--underline-width', '100%')
                        }}
                      >
                        {item}
                        <span
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-accent smooth-transition"
                          style={{ width: '0%' }}
                        ></span>
                      </a>
                    </li>
                  )
                )}
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden bg-none border-none text-2xl text-primary cursor-pointer smooth-transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden pb-4">
              <ul className="flex flex-col list-none gap-4">
                {['HOME', 'ABOUT', 'SERVICES', 'TEAM', 'CONTACT'].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="no-underline text-gray-800 font-semibold text-sm uppercase tracking-wider block py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </nav>
          )}
        </div>
      </header>

      <style jsx>{`
        header {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        header.scrolled {
          padding: 5px 0;
          background: rgba(255, 255, 255, 0.95);
        }

        a {
          position: relative;
        }

        a::before {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          background-color: #e76f51;
          bottom: 0;
          left: 50%;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        a:hover::before {
          width: 100%;
        }

        a:hover {
          color: #1a5f7a;
        }
      `}</style>
    </>
  )
}
