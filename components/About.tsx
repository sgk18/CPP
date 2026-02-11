"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2 id="about-title">About Us</h2>
          <p id="about-desc">Our journey towards a more peaceful world.</p>
        </div>

        <div className="about-content">
          <div className="about-text" data-aos="fade-right">
            <p id="about-content-1">
              Established in 2023, the <strong style={{ color: "var(--primary)" }}>Centre for Peace Praxis</strong> aims
              at building communities of hope, healing, and resilience.
            </p>
            <p id="about-content-2">
              We believe that peace is not just the absence of conflict, but the presence of justice, understanding, and
              active cooperation. To achieve this, we organize regular workshops, dialogues, and events that spread peace
              literacy.
            </p>
            <p id="about-content-3">
              Aligned with our pillars—Media Literacy, Psychosocial Support, Intercultural Dialogue, and Ecological
              Wellbeing—we create environments where diversity is embraced as a strength.
            </p>
            <Link
              href="/#volunteer"
              className="workshop-btn"
              style={{ justifyContent: "flex-start", border: "none", paddingLeft: 0, fontSize: "1.1rem" }}
              id="about-link"
            >
              Read Our Full Story <FaArrowRight style={{ marginLeft: "5px" }} />
            </Link>
          </div>

          <div className="about-img" data-aos="fade-left">
            <Image
              id="about-image"
              src="/peaceaxis_image1.jpg"
              alt="Community building and dialogue"
              width={600}
              height={400}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
