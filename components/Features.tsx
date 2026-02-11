"use client";

import { FaHandsHelping, FaUserGraduate, FaLaughBeam } from "react-icons/fa";

export default function Features() {
  return (
    <section id="why">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2 id="why-title">Why Centre for Peace Praxis?</h2>
          <p id="why-desc">
            Empowering individuals <span style={{ letterSpacing: "2px" }}>to become a</span>gents of positive change.
          </p>
        </div>

        <div className="features">
          <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
            <div className="feature-icon">
              <FaHandsHelping />
            </div>
            <h3 id="feature-1-title">Make a Real Difference!</h3>
            <p id="feature-1-desc">
              Contribute to meaningful peacebuilding initiatives that create lasting impact locally and globally.
            </p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
            <div className="feature-icon">
              <FaUserGraduate />
            </div>
            <h3 id="feature-2-title">Build Capacity!</h3>
            <p id="feature-2-desc">
              Develop essential skills in communication, teamwork, creativity, and conflict resolution.
            </p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
            <div className="feature-icon">
              <FaLaughBeam />
            </div>
            <h3 id="feature-3-title">Have Fun!</h3>
            <p id="feature-3-desc">
              Connect with like-minded people, work on creative projects, and be part of a vibrant community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
