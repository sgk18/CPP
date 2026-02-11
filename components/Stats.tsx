"use client";

export default function Stats() {
  return (
    <div className="stats-section">
      <div className="container">
        <div className="stats-grid">
          <div className="stat-item" data-aos="zoom-in">
            <h3 id="stat-1-number">20+</h3>
            <p id="stat-1-label">Workshops Conducted</p>
          </div>
          <div className="stat-item" data-aos="zoom-in" data-aos-delay="100">
            <h3 id="stat-2-number">1000+</h3>
            <p id="stat-2-label">Participants</p>
          </div>
          <div className="stat-item" data-aos="zoom-in" data-aos-delay="200">
            <h3 id="stat-3-number">15+</h3>
            <p id="stat-3-label">Partner Organizations</p>
          </div>
          <div className="stat-item" data-aos="zoom-in" data-aos-delay="300">
            <h3 id="stat-4-number">4</h3>
            <p id="stat-4-label">Core Pillars</p>
          </div>
        </div>
      </div>
    </div>
  );
}
