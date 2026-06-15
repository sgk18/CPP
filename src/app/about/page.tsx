"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Globe, Heart, Compass, Shield, Newspaper, Leaf, Mail } from "lucide-react";

const DEFAULT = {
  missionTitle: "Our Mission",
  mission: "To build communities of hope, healing, and resilience through peace literacy, intercultural dialogue, and collective well-being.",
  visionTitle: "Our Vision",
  vision: "A world where every individual is an active agent of peace — rooted in justice, empathy, and ecological consciousness.",
  storyTitle: "Our Story",
  story: "Established in 2023 at Christ (Deemed to be University), Bengaluru, the Centre for Peace Praxis emerged from the belief that peace education is not a luxury, but a necessity.",
  pillar1Title: "Intercultural Dialogue",
  pillar1Desc: "Fostering understanding and respect across diverse cultures, beliefs, and backgrounds through open conversations.",
  pillar2Title: "Psycho-social Well-being",
  pillar2Desc: "Supporting mental and emotional health through community-based approaches to healing and resilience.",
  pillar3Title: "Media Literacy",
  pillar3Desc: "Developing critical thinking skills to navigate today's complex media landscape and counter misinformation.",
  pillar4Title: "Eco-consciousness",
  pillar4Desc: "Promoting environmental awareness and sustainable practices as integral components of peace.",
  directorName: "Dr. Padmakumar MM",
  directorTitle: "Director, Centre for Peace Praxis",
  directorMessage: "At the Centre for Peace Praxis, we believe that peace begins within — in how we relate to ourselves, to each other, and to the world around us. Our work is grounded in the conviction that peace is not passive, but an active practice of compassion, justice, and hope.",
  directorImage: "/assets/peaceaxis_image5.jpg",
  teamTitle: "Our Team",
  teamDesc: "A dedicated team of educators, students, and community partners committed to peacebuilding.",
};

const STRATEGIC_PLAN = [
  {
    title: "Focus Area I: Impactful Research, Innovation and Enterprise",
    subsections: [
      {
        title: "a. Enhancing Research Excellence",
        goals: [
          {
            title: "Goal 1: Foster and support high-quality research initiatives.",
            actionPlan: "Collaborate with International Peace Research Institute, NIAS",
            indicators: "Joint publications (write for Conflict Weekly), Exchange visits between researchers",
            target: "1 Joint Publication & 1 Exchange visit by April '25 | 2 Joint Publications & 2 Exchange visits by Sept '26"
          },
          {
            title: "Goal 2: Revenue generation through research and consultancy",
            actionPlan: "Network with Social Sector units and corporates",
            indicators: "No. of Workshops on Crucial Conversations, Crisis Resolution, and Promoting Cultures of Peace",
            target: "1 Workshop of each type by April '25 | 2 Workshops of each type by Sept '26"
          },
          {
            title: "Goal 3: National and International partnerships for research publications, projects, conferences/seminars, other activities.",
            actionPlan: "Collaborate with IPRI, MPI, Solutions Journalism Network (conduct workshops, enable internships)",
            indicators: "Number of student-led mini workshops with IPRI (twice in a semester), internships with MPI leading to field-based projects",
            target: "1 Event with IPRI/MPI, SJN formation, 1 workshop/internship by April '25 | 2 Events with IPRI/MPI, 1 Solutions Journalism Networking Event, 2 workshops/internships by Sept '26"
          }
        ]
      },
      {
        title: "b. Cultivating a Research and Innovation Culture",
        goals: [
          {
            title: "Goal 1: Advancement of academic research culture",
            actionPlan: "Enable a Book project with IPRI (Johan Galtung reader)",
            indicators: "Book Project",
            target: "1 Book Project in collaboration with IPRI"
          }
        ]
      }
    ]
  },
  {
    title: "Focus Area II: Meaningful Societal Engagement",
    subsections: [
      {
        title: "a. Sustainable Development Goals (SDG)",
        goals: [
          {
            title: "Goal 1: Collaboration / extension / outreach activities for SDGs",
            actionPlan: "Collaborate with WCS, WWF (Sensitisation events related to Human-Animal coexistence)",
            indicators: "Sensitisation events organised on Human-Animal Coexistence",
            target: "4 Sensitisation events (2 WCS, 2 WWF) by the end of 2026"
          }
        ]
      },
      {
        title: "b. Policy recommendations to Government and external agencies",
        goals: [
          {
            title: "Goal 1: Establish research hubs, advocacy committees, and advisory panels.",
            actionPlan: "Work on Climate Solutions, Media Literacy, and Human-Animal Coexistence policies",
            indicators: "Bring about / Submit Policies to think tanks, government agencies, or forest officials",
            target: "Submit Policies on Climate Solutions to thinktank, Media Literacy to Government Agencies, and Coexistence to Forest Officials by end of 2026"
          }
        ]
      }
    ]
  },
  {
    title: "Focus Area III: Positive Organizational Culture for Gainful Campus Life",
    subsections: [
      {
        title: "a. Staff Development and Well-being",
        goals: [
          {
            title: "Goal 1: Creating a positive and productive work environment",
            actionPlan: "Capacity-building events to promote positive organisational culture for Centres and Departments",
            indicators: "Workshops conducted",
            target: "1 workshop by April 2025 | 2 workshops by April 2026"
          },
          {
            title: "Goal 2: Promote well-being of staff",
            actionPlan: "Conduct workshops on crucial conversations, crisis resolution, and psychosocial wellbeing",
            indicators: "Workshops conducted for security staff (crucial conversations) and students (crisis & psychosocial)",
            target: "1 of each workshop by April 2025 | 2 of each workshop by April 2026"
          }
        ]
      },
      {
        title: "b. Governance and Leadership",
        goals: [
          {
            title: "Goal 1: Advisory board engagement",
            actionPlan: "Establish Advisory Board (Siddharth - Fireflies, Christine Vertucci - MPI)",
            indicators: "Advisory meetings conducted & implementation of inputs",
            target: "Advisory board in place, regular meetings conducted, implement 3 big-item inputs shared by board"
          },
          {
            title: "Goal 2: Visibility and Communication",
            actionPlan: "Collaborate with other peace networks, activate LinkedIn and Instagram, hold workshops/field visits",
            indicators: "Number of followers, peace impact events",
            target: "Reach 100 followers by end of 2025 (250 by end of 2026), 3 Peace impact events"
          },
          {
            title: "Goal 3: Resource Planning & Resource Utilisation",
            actionPlan: "Recruit Faculty members (core team), present man-power & financial budget, train interested faculty",
            indicators: "Faculty team size, budget analysis",
            target: "At least 4 faculty members in the core team, present man-power & financial budget, have annual budget analysis"
          }
        ]
      }
    ]
  }
];

export default function About() {
  const [content] = useState(DEFAULT);
  const [activeTab, setActiveTab] = useState(0);

  const values = [
    {
      title: "Inclusivity",
      desc: "Embracing diversity as a core strength, fostering safe tables where every voice and perspective is respected.",
      icon: <Globe className="w-6 h-6 text-secondary" />
    },
    {
      title: "Compassion",
      desc: "Nurturing emotional connection and mutual care as essential foundations for community healing.",
      icon: <Heart className="w-6 h-6 text-secondary" />
    },
    {
      title: "Active Dialogue",
      desc: "Cultivating listening skills and critical thinking to navigate difficult topics without hostility.",
      icon: <Compass className="w-6 h-6 text-secondary" />
    },
    {
      title: "Ethical Responsibility",
      desc: "Inspiring individuals and leaders to align actions with sustainable practices and social justice values.",
      icon: <Shield className="w-6 h-6 text-secondary" />
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-grow pt-[97px]">
        {/* Page Header */}
        <section
          className="relative py-24 px-6 text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85)), url('/assets/volunteer_bg.jpg')`
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
              About Us
            </h1>
            <p className="text-lg text-white/80 font-light max-w-xl mx-auto">
              Our journey towards a more peaceful, just, and resilient world.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col gap-24">
            
            {/* Story */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col gap-6">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Who We Are</span>
                <h2 className="text-3xl font-display font-bold text-dark">
                  {content.storyTitle}
                </h2>
                <div className="h-1 bg-accent w-12" />
                <div className="text-gray-text text-base leading-relaxed flex flex-col gap-4">
                  <p className="font-semibold text-primary whitespace-pre-wrap">
                    {content.story}
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 rounded-3xl -z-10" />
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-black/5">
                  <Image
                    src="/assets/peaceaxis_image1.jpg"
                    alt="Community building and dialogue praxis"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card hoverEffect={false} className="border border-black/5 bg-light/30">
                <CardContent className="p-8 flex flex-col gap-4">
                  <h3 className="text-2xl font-display font-bold text-primary">{content.visionTitle}</h3>
                  <p className="text-gray-text text-base leading-relaxed">
                    {content.vision}
                  </p>
                </CardContent>
              </Card>

              <Card hoverEffect={false} className="border border-black/5 bg-light/30">
                <CardContent className="p-8 flex flex-col gap-4">
                  <h3 className="text-2xl font-display font-bold text-primary">{content.missionTitle}</h3>
                  <p className="text-gray-text text-base leading-relaxed">
                    {content.mission}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Values */}
            <div>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Our Core Values</span>
                <h2 className="text-3xl font-display font-bold text-dark mt-2">
                  What Guides Our Work
                </h2>
                <div className="h-1 bg-accent w-12 mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((v, idx) => (
                  <Card key={idx} className="border border-black/5 hover:-translate-y-2 transition-all duration-300">
                    <CardContent className="p-6 flex flex-col gap-4 text-center items-center">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                        {v.icon}
                      </div>
                      <h4 className="font-display font-bold text-primary text-base">
                        {v.title}
                      </h4>
                      <p className="text-gray-text text-xs leading-relaxed">
                        {v.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Christites for Peace Section */}
        <section id="christites" className="py-24 px-6 bg-light/30 border-t border-black/5">
          <div className="max-w-7xl mx-auto flex flex-col gap-16 animate-fade-in-up">
            
            {/* Title Block */}
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Student Representative Program</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mt-2 mb-6">
                Christites for Peace
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mb-6" />
              <p className="text-dark/90 text-base sm:text-lg font-semibold leading-relaxed">
                Inaugurated on the <span className="text-primary font-bold">16th of August 2023</span>, the Centre for Peace Praxis plans to select student members for the Centre and train them in the foundations of peacebuilding. The finalised members will become the University&apos;s representatives for peace initiatives.
              </p>
            </div>

            {/* About the Centre & UN Quote Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mt-4">
              {/* Left Column - Narrative */}
              <div className="flex flex-col justify-center gap-6 text-gray-text text-[15px] sm:text-base leading-relaxed text-justify">
                <p>
                  The well-being of any society is hugely determined by the ways in which it addresses its conflicts &mdash; both internal and external &mdash; and promotes a culture of peace. While all societies aspire for it, peace is often elusive. It requires sustained and strategic efforts where all members gain the realisation that peace is a necessity and that they ought to work for the common good. The Peace Centre at CHRIST (Deemed to be University) envisions itself to be a catalyst in such contexts.
                </p>
                <p>
                  The Centre provides training and resources for peacebuilding in the form of workshops and courses, empowering the citizenry to take up a non-violent and proactive approach during conflicts and in post-conflict contexts. People from diverse backgrounds are invited to the talking table to have free-wheeling conversations on some of the pressing concerns of our times and work out robust models for building an equitable, just, and peaceful society.
                </p>
              </div>

              {/* Right Column - UN Quote Callout Card */}
              <div className="flex items-center">
                <div className="w-full bg-white border border-black/5 rounded-3xl p-8 shadow-xl shadow-black/[0.02] relative overflow-hidden flex flex-col gap-6">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Globe className="w-5 h-5" />
                  </div>
                  <blockquote className="font-serif italic text-lg sm:text-xl text-dark leading-relaxed">
                    &ldquo;Institutions of higher learning are &hellip; important actors because they educate future leaders and peacemakers, who will shape the course of peace building in the world.&rdquo;
                  </blockquote>
                  <cite className="text-xs font-bold uppercase tracking-wider text-accent not-italic">
                    &mdash; United Nations
                  </cite>
                </div>
              </div>
            </div>

            {/* Inauguration Gallery */}
            <div className="mt-4">
              <div className="text-center mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">16th August 2023</span>
                <h3 className="text-2xl font-display font-bold text-dark mt-2">
                  Inauguration Gallery
                </h3>
                <div className="h-1 bg-accent w-12 mx-auto mt-4" />
                <p className="text-sm text-gray-text mt-3 max-w-lg mx-auto">
                  Glimpses from the inauguration of the Centre for Peace Praxis and the launch of the Christites for Peace program.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {/* Large featured image */}
                <div className="col-span-2 row-span-2 group relative overflow-hidden rounded-2xl shadow-md border border-black/5">
                  <div className="relative w-full h-full" style={{ minHeight: "340px" }}>
                    <Image
                      src="/assets/inaugration/IMG-20230819-WA0025.jpg"
                      alt="Inauguration ceremony — Centre for Peace Praxis"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-xs font-medium">Inauguration Ceremony</p>
                  </div>
                </div>

                {/* Remaining images */}
                {[
                  { src: "/assets/inaugration/IMG-20230819-WA0007.jpg", alt: "Inauguration — dignitaries gathering" },
                  { src: "/assets/inaugration/IMG-20230819-WA0013.jpg", alt: "Inauguration — address to students" },
                  { src: "/assets/inaugration/IMG-20230819-WA0014.jpg", alt: "Inauguration — ceremonial lamp lighting" },
                  { src: "/assets/inaugration/IMG-20230819-WA0028.jpg", alt: "Inauguration — student representatives" },
                  { src: "/assets/inaugration/IMG-20230819-WA0045.jpg", alt: "Inauguration — group photo" },
                  { src: "/assets/inaugration/IMG-20230819-WA0050.jpg", alt: "Inauguration — community gathering" },
                ].map((img, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl shadow-md border border-black/5 h-40 md:h-44">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <p className="text-white text-[10px] font-medium leading-tight">{img.alt.replace("Inauguration — ", "")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Focus Areas Grid */}
            <div className="mt-8">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-display font-bold text-dark">
                  Core Focus Areas
                </h3>
                <p className="text-sm text-gray-text mt-2">Empowering student leaders to practice peace praxis across critical domains</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: "Interculture Dialogue & Peacebuilding",
                    desc: "Fostering collaboration across boundaries, creating space for mutual learning and diversity.",
                    icon: <Globe className="w-6 h-6 text-primary" />
                  },
                  {
                    title: "Media & Peacebuilding",
                    desc: "Harnessing media literacy and critical narrative analysis to resist hate speech and disinformation.",
                    icon: <Newspaper className="w-6 h-6 text-primary" />
                  },
                  {
                    title: "Ecology & Peacebuilding",
                    desc: "Advocating eco-consciousness and sustainability as crucial elements of planetary and community peace.",
                    icon: <Leaf className="w-6 h-6 text-primary" />
                  },
                  {
                    title: "Psychology of Well Being & Peacebuilding",
                    desc: "Promoting resilience, mental health, and community healing support models.",
                    icon: <Heart className="w-6 h-6 text-primary" />
                  }
                ].map((area, idx) => (
                  <Card key={idx} className="border border-black/5 hover:-translate-y-1.5 transition-all duration-300 bg-white">
                    <CardContent className="p-6 flex flex-col gap-4 text-center items-center">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/5 text-primary">
                        {area.icon}
                      </div>
                      <h4 className="font-display font-bold text-dark text-sm sm:text-base leading-snug">
                        {area.title}
                      </h4>
                      <p className="text-gray-text text-xs leading-relaxed">
                        {area.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Call to Action Banner */}
            <div className="mt-8 bg-gradient-to-r from-primary to-dark text-white rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 shadow-xl shadow-primary/10">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-accent">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                Become a representative for peace initiatives
              </h3>
              <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
                Applications and training programs are scheduled periodically. For details on selection rounds and registration, get in touch with us.
              </p>
              <a
                href="mailto:peace.praxis@christuniversity.in?subject=Inquiry%20regarding%20Christites%20for%20Peace"
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md hover:scale-105"
              >
                Email For Details
              </a>
            </div>

          </div>
        </section>

        {/* Strategic Plan Section */}
        <section id="strategic-plan" className="py-24 px-6 bg-white border-t border-black/5 animate-fade-in-up">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Roadmaps & Goals</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mt-2">
                Strategic Plan 2025-2026
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mt-4" />
              <p className="text-sm text-gray-text mt-3">
                Our vision in action: targets, performance metrics, and tactical initiatives mapping our course for the next two years.
              </p>
            </div>

            {/* Tabs selector */}
            <div className="flex flex-wrap gap-2 justify-center mb-12 border-b border-black/5 pb-6">
              {STRATEGIC_PLAN.map((area, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`text-xs px-5 py-3 rounded-xl border font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    activeTab === idx
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/15"
                      : "bg-white border-black/5 text-gray-500 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  Focus Area {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Tab Content */}
            <div className="space-y-8">
              <div className="bg-[#1A5F7A]/5 border border-[#1A5F7A]/10 rounded-2xl p-4 mb-8">
                <h3 className="text-sm sm:text-base font-display font-bold text-primary flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                  {STRATEGIC_PLAN[activeTab].title}
                </h3>
              </div>
              
              <div className="flex flex-col gap-8">
                {STRATEGIC_PLAN[activeTab].subsections.map((sub, sIdx) => (
                  <div key={sIdx} className="bg-light/15 border border-black/5 rounded-2xl p-6 md:p-8 shadow-sm">
                    <h4 className="text-sm sm:text-md font-display font-bold text-accent mb-6 border-b border-black/5 pb-2">
                      {sub.title}
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs md:text-sm">
                        <thead>
                          <tr className="border-b border-black/10 text-dark font-bold">
                            <th className="pb-3 pr-4 w-1/4 uppercase tracking-wider font-display text-[10px]">Goal</th>
                            <th className="pb-3 pr-4 w-1/4 uppercase tracking-wider font-display text-[10px]">Action Plan</th>
                            <th className="pb-3 pr-4 w-1/4 uppercase tracking-wider font-display text-[10px]">Performance Indicators</th>
                            <th className="pb-3 w-1/4 uppercase tracking-wider font-display text-[10px]">Targets</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.03] text-gray-text">
                          {sub.goals.map((goal, gIdx) => (
                            <tr key={gIdx} className="hover:bg-white/[0.4] transition-colors">
                              <td className="py-4 pr-4 align-top font-semibold text-dark">{goal.title}</td>
                              <td className="py-4 pr-4 align-top leading-relaxed">{goal.actionPlan}</td>
                              <td className="py-4 pr-4 align-top leading-relaxed">{goal.indicators}</td>
                              <td className="py-4 align-top leading-relaxed font-semibold text-primary">{goal.target}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
