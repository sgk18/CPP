"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Workshops() {
  return (
    <section id="workshops">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2 id="workshops-title">Our Workshops</h2>
          <p id="workshops-desc">Engaging, educational, and transformative experiences.</p>
        </div>

        <div className="workshop-grid">
          {/* Card New */}
          <div className="workshop-card" data-aos="fade-up" data-aos-delay="100">
            <div className="workshop-img">
              <span className="badge">New</span>
              <Image
                src="/changing_rains_poster.jpg"
                alt="Changing Rains"
                width={400}
                height={230}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                id="workshop-1-img"
              />
            </div>
            <div className="workshop-content">
              <h4 id="workshop-1-title">Changing Rains</h4>
              <p id="workshop-1-desc">
                An interdisciplinary academic event that examined shifting rainfall patterns and their impacts on
                Southwestern India, featuring experts discussing climate prediction and urban vulnerability.
              </p>
              <Link href="/Changing_rains.html" className="workshop-btn" id="workshop-1-link">
                View Workshop Details <FaArrowRight style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>

          {/* Card 1 */}
          <div className="workshop-card" data-aos="fade-up" data-aos-delay="100">
            <div className="workshop-img">
              <span className="badge">Popular</span>
              <Image
                src="/Bridging_Hearts_poster.jpeg"
                alt="Foundations of Peace"
                width={400}
                height={230}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                id="workshop-2-img"
              />
            </div>
            <div className="workshop-content">
              <h4 id="workshop-2-title">Bridging Hearts</h4>
              <p id="workshop-2-desc">
                The Bridging Hearts workshop engaged students in interactive activities and dialogue to explore the
                emotional, social, and structural dimensions of peace, fostering empathy, critical thinking, and youth
                leadership in peacebuilding.
              </p>
              <Link href="/Bridging_Hearts.html" className="workshop-btn" id="workshop-2-link">
                View Workshop Details <FaArrowRight style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="workshop-card" data-aos="fade-up" data-aos-delay="200">
            <div className="workshop-img">
              <Image
                src="/gallery_img_4.jpg"
                alt="Forgiveness Across Faiths"
                width={400}
                height={230}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                id="workshop-3-img"
              />
            </div>
            <div className="workshop-content">
              <h4 id="workshop-3-title">Dares you to be different</h4>
              <p id="workshop-3-desc">
                The panel discussion ‘Not Less, Different’ brought together voices from media, academia, and student
                experience to discuss disability, inclusion, and accessibility. The session highlighted inclusive
                language, lived experiences, and the responsibility of institutions and media in creating an empathetic
                and inclusive society.
              </p>
              <Link href="/Dares_you_to_be_different.html" className="workshop-btn" id="workshop-3-link">
                View Workshop Details <FaArrowRight style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="workshop-card" data-aos="fade-up" data-aos-delay="300">
            <div className="workshop-img">
              <Image
                src="/hero_bg_new.jpg"
                alt="Orientation Workshop"
                width={400}
                height={230}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                id="workshop-4-img"
              />
            </div>
            <div className="workshop-content">
              <h4 id="workshop-4-title">Orientation Workshop</h4>
              <p id="workshop-4-desc">
                Introducing Peace Practices to new students. The session explored how peacebuilding extends beyond
                conflict resolution to include personal, social, and ecological well-being.
              </p>
              <Link href="/Oreintation.html" className="workshop-btn" id="workshop-4-link">
                View Workshop Details <FaArrowRight style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="workshop-card" data-aos="fade-up" data-aos-delay="400">
            <div className="workshop-img">
              <span className="badge">New</span>
              <Image
                src="/role_of_religous.jpeg"
                alt="role of religious"
                width={400}
                height={230}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                id="workshop-5-img"
              />
            </div>
            <div className="workshop-content">
              <h4 id="workshop-5-title">Role of Religious</h4>
              <p id="workshop-5-desc">
                The guest lecture on the role of religious leaders in climate action explored how faith-based values of
                stewardship and compassion can inspire ethical responsibility, interfaith collaboration, and
                community-driven environmental sustainability.
              </p>
              <Link href="/role_of_religous.html" className="workshop-btn" id="workshop-5-link">
                View Workshop Details <FaArrowRight style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>

          {/* Card 5 */}
          <div className="workshop-card" data-aos="fade-up" data-aos-delay="500">
            <div className="workshop-img">
              <Image
                src="/Poster.jpeg"
                alt="sdg week"
                width={400}
                height={230}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                id="workshop-6-img"
              />
            </div>
            <div className="workshop-content">
              <h4 id="workshop-6-title">SDG Week</h4>
              <p id="workshop-6-desc">
                The two-day SDG Week activity engaged participants in discussions on co-existence and urban biodiversity,
                highlighting the impact of human encroachment on ecosystems and the need for sustainable conservation
                practices.
              </p>
              <Link href="/SDG_week.html" className="workshop-btn" id="workshop-6-link">
                View Workshop Details <FaArrowRight style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>

          <div className="workshop-card" data-aos="fade-up" data-aos-delay="600">
            <div className="workshop-img">
              <Image
                src="/story_wheel_poster.jpg"
                alt="story wheel"
                width={400}
                height={230}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                id="workshop-7-img"
              />
            </div>
            <div className="workshop-content">
              <h4 id="workshop-7-title">STORY WHEEL</h4>
              <p id="workshop-7-desc">
                A participatory storytelling process that brings communities together to share experiences, build empathy,
                and explore pathways to peace through dialogue.
              </p>
              <Link href="/Story_Wheel.html" className="workshop-btn" id="workshop-7-link">
                View Workshop Details <FaArrowRight style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
