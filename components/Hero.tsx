"use client";

import Link from "next/link";
import { useEffect } from "react";
// AOS import handles animations in layout/page, but data-aos attributes work here

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content" data-aos="zoom-in" data-aos-duration="1000">
        <h1 id="hero-title">
          <span>Welcome To</span>Hope, Healing <br />& Resilience
        </h1>
        <p id="hero-desc">
          Building communities through peace literacy, intercultural dialogue, and collective well-being since 2023.
        </p>
        <div className="hero-buttons">
          <Link href="/#volunteer" className="cta-button" id="hero-btn-primary">
            Join Our Mission
          </Link>
          <Link href="/#workshops" className="cta-button secondary" id="hero-btn-secondary">
            View Workshops
          </Link>
        </div>
      </div>
      <Link href="/#why" className="scroll-down">
        <i className="fas fa-chevron-down"></i>
      </Link>
    </section>
  );
}
