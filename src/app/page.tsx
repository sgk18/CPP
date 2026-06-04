"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { workshops } from "@/constants/workshops";
import {
  HeartHandshake,
  GraduationCap,
  Sparkles,
  Globe,
  Heart,
  Newspaper,
  Leaf,
  ArrowRight,
  Send
} from "lucide-react";

// Default content for Site Builder
const DEFAULT_CONTENT = {
  heroTitle: "Hope, Healing & Resilience",
  heroDesc: "Building communities through peace literacy, intercultural dialogue, and collective well-being since 2023.",
  aboutContent1: "Established in 2023, the Centre for Peace Praxis aims at building communities of hope, healing, and resilience.",
  aboutContent2: "We believe that peace is not just the absence of conflict, but the presence of justice, understanding, and active cooperation. To achieve this, we organize regular workshops, dialogues, and events that spread peace literacy.",
  aboutContent3: "Aligned with our pillars—Media Literacy, Psychosocial Support, Intercultural Dialogue, and Ecological Wellbeing—we create environments where diversity is embraced as a strength.",
  stat1: "20+",
  stat2: "1000+",
  stat3: "15+",
  stat4: "4",
  volunteerQuote: "“Peace is hard-earned, intentional, and sustained through listening, inclusion, and hope.”"
};

export default function Home() {
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    const saved = localStorage.getItem("cpp_builder_content");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setContent((prev) => ({ ...prev, ...parsed }));
        }, 0);
      } catch (e) {
        console.error("Failed parsing custom builder content", e);
      }
    }
  }, []);

  const features = [
    {
      title: "Make a Real Difference!",
      desc: "Contribute to meaningful peacebuilding initiatives that create lasting impact locally and globally.",
      icon: <HeartHandshake className="w-8 h-8 text-primary" />
    },
    {
      title: "Build Capacity!",
      desc: "Develop essential skills in communication, teamwork, creativity, and conflict resolution.",
      icon: <GraduationCap className="w-8 h-8 text-primary" />
    },
    {
      title: "Have Fun!",
      desc: "Connect with like-minded people, work on creative projects, and be part of a vibrant community.",
      icon: <Sparkles className="w-8 h-8 text-primary" />
    }
  ];

  const pillars = [
    {
      title: "Intercultural Dialogue",
      desc: "Fostering understanding and respect across diverse cultures, beliefs, and backgrounds through open conversations.",
      icon: <Globe className="w-6 h-6 text-secondary" />
    },
    {
      title: "Psycho-social Well-being",
      desc: "Supporting mental and emotional health through community-based approaches to healing and resilience.",
      icon: <Heart className="w-6 h-6 text-secondary" />
    },
    {
      title: "Media Literacy",
      desc: "Developing critical thinking skills to navigate today's complex media landscape and counter misinformation.",
      icon: <Newspaper className="w-6 h-6 text-secondary" />
    },
    {
      title: "Eco-consciousness",
      desc: "Promoting environmental awareness and sustainable practices as integral components of peace.",
      icon: <Leaf className="w-6 h-6 text-secondary" />
    }
  ];

  const upcomingEvents = [
    {
      title: "Inter-Religious Visit",
      date: "20 Feb 2026",
      desc: "A one-day visit to multiple religious institutions including Gurudwara, Mahabodhi, and Dharmaram. Participation from students and faculty.",
      image: "/assets/peaceaxis_image11.jpg"
    },
    {
      title: "Film Festival & Panel Discussion",
      date: "24 Feb 2026",
      desc: "A one-day film screening followed by a panel discussion, scheduled for 24th February 2026.",
      image: "/assets/peaceaxis_image9.jpg"
    },
    {
      title: "Psychosocial Well-being Workshop",
      date: "19 Feb 2026",
      desc: "A 3-hour workshop on “Resilience and Recovery” with e-certificates and student coordinators from each campus.",
      image: "/assets/peaceaxis_image12.jpg"
    },
    {
      title: "SDG Week – NGO Stalls",
      date: "SDG Week",
      desc: "NGO stalls to be set up during SDG Week in the second week of February 2026 to promote sustainable development goals.",
      image: "/assets/peaceaxis_image6.jpg"
    },
    {
      title: "Volunteer in Philippines",
      date: "May 2026",
      desc: "International volunteering opportunity from May 12-31, 2026 at Mindanao Peacebuilding Institute.",
      image: "/assets/volunteer_philippines.jpg"
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-grow pt-[97px]">
        {/* Hero Section */}
        <section
          id="home"
          className="relative min-h-[85vh] flex items-center justify-center text-center py-20 px-6 overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85)), url('/assets/volunteer_bg.jpg')`,
            backgroundAttachment: "fixed"
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 animate-fade-in-up">
            <span className="font-display text-xs sm:text-sm font-bold tracking-widest uppercase text-light-blue bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
              Welcome To
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {content.heroTitle}
            </h1>
            <p className="text-lg sm:text-xl font-light text-white/90 leading-relaxed max-w-2xl">
              {content.heroDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <Button variant="accent" size="lg" onClick={() => document.getElementById("volunteer")?.scrollIntoView({ behavior: "smooth" })}>
                Join Our Mission
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => document.getElementById("workshops")?.scrollIntoView({ behavior: "smooth" })}>
                View Workshops
              </Button>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section id="why" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-4">
                Why Centre for Peace Praxis?
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mb-4" />
              <p className="text-gray-text text-base sm:text-lg">
                Empowering individuals to become agents of positive change.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feat, idx) => (
                <Card key={idx} className="flex flex-col h-full border border-black/5 hover:-translate-y-2 transition-all duration-300">
                  <CardContent className="p-8 text-center flex flex-col items-center gap-6 flex-grow">
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary/5 text-primary">
                      {feat.icon}
                    </div>
                    <h3 className="text-xl font-display font-semibold text-dark">
                      {feat.title}
                    </h3>
                    <p className="text-gray-text text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-dark text-white text-center px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-light-blue">{content.stat1}</span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/80">Workshops Conducted</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-light-blue">{content.stat2}</span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/80">Participants</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-light-blue">{content.stat3}</span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/80">Partner Organizations</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-light-blue">{content.stat4}</span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/80">Core Pillars</span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6 bg-light/30">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">About Us</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark">
                Our Journey Towards A More Peaceful World
              </h2>
              <div className="h-1 bg-accent w-12" />
              <div className="text-gray-text text-base sm:text-lg flex flex-col gap-4 leading-relaxed">
                <p className="font-semibold text-primary">{content.aboutContent1}</p>
                <p>{content.aboutContent2}</p>
                <p>{content.aboutContent3}</p>
              </div>
              <div className="mt-4">
                <Link href="/about">
                  <Button variant="outline" className="gap-2">
                    Read Our Full Story <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-secondary/10 rounded-3xl -z-10 group-hover:scale-[1.02] transition-transform duration-500" />
              <img
                src="/assets/peaceaxis_image1.jpg"
                alt="Community building praxis event"
                className="w-full h-auto rounded-2xl shadow-xl border border-black/5"
              />
            </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section id="pillars" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">The Foundation</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-4 mt-2">
                Our Core Pillars
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mb-4" />
              <p className="text-gray-text">
                The foundation of our approach to peacebuilding.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-5 p-6 rounded-2xl bg-light/30 border border-black/5 hover:bg-white hover:shadow-xl hover:shadow-black/[0.05] transition-all duration-300"
                >
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    {pillar.icon}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-display font-bold text-primary">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-text text-sm leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section id="upcoming" className="py-24 px-6 bg-light/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Calendar</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-4 mt-2">
                Upcoming Events
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mb-4" />
              <p className="text-gray-text">
                Mark your calendars and join us!
              </p>
            </div>

            {/* Horizontal Scroll or Grid depending on screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((evt, idx) => (
                <Card key={idx} className="flex flex-col h-full hover:-translate-y-2 transition-all duration-300">
                  <div className="h-48 relative overflow-hidden bg-primary/10">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                      {evt.date}
                    </div>
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-display font-bold text-dark">
                        {evt.title}
                      </h3>
                      <p className="text-gray-text text-sm leading-relaxed line-clamp-3">
                        {evt.desc}
                      </p>
                    </div>
                    <div>
                      <Button variant="ghost" className="px-0 gap-2 hover:bg-transparent text-primary hover:text-accent p-0 cursor-pointer font-bold">
                        Register Now <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Workshops Catalog Section */}
        <section id="workshops" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Portfolio</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-4 mt-2">
                Our Workshops
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mb-4" />
              <p className="text-gray-text">
                Engaging, educational, and transformative experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workshops.map((w) => (
                <Card key={w.slug} className="flex flex-col h-full hover:-translate-y-2 transition-all duration-300">
                  <div className="h-52 relative overflow-hidden bg-primary/10">
                    <img
                      src={w.gallery[0]}
                      alt={w.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    {w.badge && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-accent to-secondary text-white text-xs font-bold rounded-full shadow-md">
                        {w.badge}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col justify-between gap-6">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">{w.tag}</span>
                      <h3 className="text-xl font-display font-bold text-dark">
                        {w.title}
                      </h3>
                      <p className="text-gray-text text-sm leading-relaxed line-clamp-3">
                        {w.summary}
                      </p>
                    </div>
                    <div>
                      <Link href={`/workshops/${w.slug}`}>
                        <Button variant="outline" className="w-full justify-center gap-2">
                          View Workshop Details <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Volunteer Section */}
        <section
          id="volunteer"
          className="py-24 px-6 bg-cover bg-center text-white text-center relative"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.95), rgba(38, 70, 83, 0.9)), url('/assets/volunteer_bg.jpg')`
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-accent">
              Volunteer With Us
            </h2>
            <p className="text-lg leading-relaxed text-white/80 max-w-2xl">
              Volunteering at the Centre for Peace Praxis is your chance to make a real difference. You&apos;ll level up your skills—communication, teamwork, creativity—while connecting with an awesome network.
            </p>

            {/* Testimonials Quote */}
            <div className="w-full max-w-xl bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm text-left flex flex-col gap-6">
              <p className="text-base italic text-white/90 leading-relaxed font-serif">
                {content.volunteerQuote}
              </p>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20">
                    <img src="/assets/peaceaxis_image5.jpg" alt="Dr. Padmakumar MM" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Dr. Padmakumar MM</h4>
                    <p className="text-xs text-white/60">Director, Centre for Peace Praxis</p>
                  </div>
                </div>
                <Link href="/directors-note">
                  <span className="text-xs font-semibold text-secondary hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                    Read note <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>

              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20">
                  <img src="/assets/studentcoordinator.jpg" alt="Ravi Ranjan" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Ravi Ranjan Sharma</h4>
                  <p className="text-xs text-white/60">Student Coordinator, Centre for Peace Praxis</p>
                </div>
              </div>
            </div>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScmjweCQfwquN_aHSy9Tz_DkvodQwyqULN-3AQ19-SfWxP2Lw/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4"
            >
              <Button variant="accent" size="lg" className="gap-2">
                Become a Volunteer <Send className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
