"use client";

import { FaGlobeAmericas, FaHeart, FaNewspaper, FaLeaf } from "react-icons/fa";

export default function Pillars() {
  return (
    <section className="pillars" id="pillars">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2 id="pillars-title">Our Core Pillars</h2>
          <p id="pillars-desc">The foundation of our approach to peacebuilding.</p>
        </div>

        <div className="pillar-grid">
          <div className="pillar-item" data-aos="fade-up" data-aos-delay="100">
            <div className="pillar-icon">
              <FaGlobeAmericas />
            </div>
            <div>
              <h3 id="pillar-1-title">Intercultural Dialogue</h3>
              <p id="pillar-1-desc">
                Fostering understanding and respect across diverse cultures, beliefs, and backgrounds through open
                conversations.
              </p>
            </div>
          </div>

          <div className="pillar-item" data-aos="fade-up" data-aos-delay="200">
            <div className="pillar-icon">
              <FaHeart />
            </div>
            <div>
              <h3 id="pillar-2-title">Psycho-social Well-being</h3>
              <p id="pillar-2-desc">
                Supporting mental and emotional health through community-based approaches to healing and resilience.
              </p>
            </div>
          </div>

          <div className="pillar-item" data-aos="fade-up" data-aos-delay="300">
            <div className="pillar-icon">
              <FaNewspaper />
            </div>
            <div>
              <h3 id="pillar-3-title">Media Literacy</h3>
              <p id="pillar-3-desc">
                Developing critical thinking skills to navigate today's complex media landscape and counter misinformation.
              </p>
            </div>
          </div>

          <div className="pillar-item" data-aos="fade-up" data-aos-delay="400">
            <div className="pillar-icon">
              <FaLeaf />
            </div>
            <div>
              <h3 id="pillar-4-title">Eco-consciousness</h3>
              <p id="pillar-4-desc">
                Promoting environmental awareness and sustainable practices as integral components of peace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
