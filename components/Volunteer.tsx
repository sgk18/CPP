"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Volunteer() {
  return (
    <section className="volunteer" id="volunteer">
      <div className="container">
        <div className="volunteer-content" data-aos="zoom-in">
          <div className="section-title">
            <h2 id="volunteer-title" className="special">
              Volunteer With Us
            </h2>
          </div>

          <p id="volunteer-desc">
            Volunteering at the Centre for Peace Praxis is your chance to make a real difference. You'll level up your
            skills—communication, teamwork, creativity—while connecting with an awesome network.
          </p>

          <div className="quote">
            <p id="volunteer-quote">
              “Peace is hard-earned, intentional, and sustained through listening, inclusion, and hope.”
            </p>
            <div className="team-member">
              <div className="team-avatar">
                <Image
                  src="/peaceaxis_image5.jpg"
                  alt="Dr. Padmakumar MM"
                  width={90}
                  height={90}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  id="member-1-img"
                />
              </div>
              <div className="team-info">
                <h4 id="member-1-name">Dr. Padmakumar MM</h4>
                <p id="member-1-role">Director, Centre for Peace Praxis</p>
                <Link href="/Directors_note.html" className="read-more-link" target="_blank" id="member-1-link">
                  Read More <FaArrowRight style={{ marginLeft: "5px" }} />
                </Link>
              </div>
            </div>
            <div className="team-member">
              <div className="team-avatar">
                <Image
                  src="/Ravi ranjan.jpeg"
                  alt="Ravi Ranjan"
                  width={90}
                  height={90}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  id="member-2-img"
                />
              </div>
              <div className="team-info">
                <h4 style={{ marginTop: "10px" }} id="member-2-name">
                  RAVI RANJAN SHARMA
                </h4>
                <p style={{ fontSize: "0.9rem", color: "var(--gray)" }} id="member-2-role">
                  Student Coordinator, Centre for Peace Praxis
                </p>
                <p
                  className="text-sm italic mt-1"
                  style={{ fontSize: "0.85rem", color: "var(--accent)" }}
                  id="member-2-quote"
                >
                  "Driven by the idea that meaningful conversations can create lasting peace"
                </p>
              </div>
            </div>
          </div>

          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLScmjweCQfwquN_aHSy9Tz_DkvodQwyqULN-3AQ19-SfWxP2Lw/viewform?usp=sf_link"
            target="_blank"
            className="cta-button"
            id="volunteer-cta"
          >
            Become a Volunteer
          </Link>
        </div>
      </div>
    </section>
  );
}
