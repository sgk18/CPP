"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function UpcomingEvents() {
  return (
    <section id="upcoming">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2 id="upcoming-title">Upcoming Events</h2>
          <p id="upcoming-desc">Mark your calendars and join us!</p>
        </div>

        <div className="workshop-grid">
          {/* Event 1 */}
          <div className="workshop-card" data-aos="fade-up" data-aos-delay="100">
            <div className="workshop-img">
              <span className="badge" style={{ background: "var(--primary)" }} id="upcoming-1-date">
                20 Feb 2026
              </span>
              <Image
                src="/peaceaxis_image11.jpg"
                alt="Inter-Religious Visit"
                width={400}
                height={230}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                id="upcoming-1-img"
              />
            </div>
            <div className="workshop-content">
              <h4 id="upcoming-1-title">Inter-Religious Visit</h4>
              <p id="upcoming-1-desc">
                A one-day visit to multiple religious institutions including Gurudwara, Mahabodhi, and Dharmaram.
                Participation from students and faculty.
              </p>
              <Link href="#" className="workshop-btn" id="upcoming-1-link">
                Register Now <FaArrowRight style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>

          {/* Event 2 */}
          <div className="workshop-card" data-aos="fade-up" data-aos-delay="200">
            <div className="workshop-img">
              <span className="badge" style={{ background: "var(--primary)" }} id="upcoming-2-date">
                24 Feb 2026
              </span>
              <Image
                src="/peaceaxis_image9.jpg"
                alt="Film Festival"
                width={400}
                height={230}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                id="upcoming-2-img"
              />
            </div>
            <div className="workshop-content">
              <h4 id="upcoming-2-title">Film Festival & Panel Discussion</h4>
              <p id="upcoming-2-desc">
                A one-day film screening followed by a panel discussion, scheduled for 24th February 2026.
              </p>
              <Link href="#" className="workshop-btn" id="upcoming-2-link">
                Register Now <FaArrowRight style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>

          {/* Event 3 */}
          <div className="workshop-card" data-aos="fade-up" data-aos-delay="300">
            <div className="workshop-img">
              <span className="badge" style={{ background: "var(--primary)" }} id="upcoming-3-date">
                19 Feb 2026
              </span>
              <Image
                src="/peaceaxis_image12.jpg"
                alt="Well-being Workshop"
                width={400}
                height={230}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                id="upcoming-3-img"
              />
            </div>
            <div className="workshop-content">
              <h4 id="upcoming-3-title">Psychosocial Well-being Workshop</h4>
              <p id="upcoming-3-desc">
                A 3-hour workshop on “Resilience and Recovery” with e-certificates and student coordinators from each
                campus.
              </p>
              <Link href="#" className="workshop-btn" id="upcoming-3-link">
                Register Now <FaArrowRight style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>

          {/* Event 4 */}
          <div className="workshop-card" data-aos="fade-up" data-aos-delay="400">
            <div className="workshop-img">
              <span className="badge" style={{ background: "var(--primary)" }} id="upcoming-4-date">
                SDG Week
              </span>
              <Image
                src="/peaceaxis_image6.jpg"
                alt="SDG Week"
                width={400}
                height={230}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                id="upcoming-4-img"
              />
            </div>
            <div className="workshop-content">
              <h4 id="upcoming-4-title">SDG Week – NGO Stalls</h4>
              <p id="upcoming-4-desc">
                NGO stalls to be set up during SDG Week in the second week of February 2026 to promote sustainable
                development goals.
              </p>
              <Link href="#" className="workshop-btn" id="upcoming-4-link">
                Register Now <FaArrowRight style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>

          {/* Event 5 */}
          <div className="workshop-card" data-aos="fade-up" data-aos-delay="500">
            <div className="workshop-img">
              <span className="badge" style={{ background: "var(--primary)" }} id="upcoming-5-date">
                May 2026
              </span>
              <Image
                src="/volunteer_philippines.jpg"
                alt="Volunteer in Philippines"
                width={400}
                height={230}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                id="upcoming-5-img"
              />
            </div>
            <div className="workshop-content">
              <h4 id="upcoming-5-title">Volunteer in Philippines</h4>
              <p id="upcoming-5-desc">
                International volunteering opportunity from May 12-31, 2026 at Mindanao Peacebuilding Institute.
              </p>
              <Link href="#" className="workshop-btn" id="upcoming-5-link">
                Register Now <FaArrowRight style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
