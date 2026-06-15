"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { getEventsAction } from "@/lib/actions/events";
import { workshops as staticWorkshops } from "@/constants/workshops";
import { Modal } from "@/components/ui/Modal";

import {
  HeartHandshake,
  GraduationCap,
  Sparkles,
  Globe,
  Heart,
  Newspaper,
  Leaf,
  ArrowRight,
  Send,
  Calendar,
  Clock,
  MapPin,
  Users
} from "lucide-react";

// Default content for Site Builder
const DEFAULT_CONTENT = {
  // Hero
  heroTitle: "Hope, Healing & Resilience",
  heroDesc: "Building communities through peace literacy, intercultural dialogue, and collective well-being since 2023.",
  
  // Why Us
  whyTitle: "Why Centre for Peace Praxis?",
  whyDesc: "Empowering individuals to become agents of positive change.",
  feature1Title: "Make a Real Difference!",
  feature1Desc: "Contribute to meaningful peacebuilding initiatives that create lasting impact locally and globally.",
  feature2Title: "Build Capacity!",
  feature2Desc: "Develop essential skills in communication, teamwork, creativity, and conflict resolution.",
  feature3Title: "Have Fun!",
  feature3Desc: "Connect with like-minded people, work on creative projects, and be part of a vibrant community.",
  
  // Stats
  stat1Value: "20+",
  stat1Label: "Activities Conducted",
  stat2Value: "1000+",
  stat2Label: "Participants",
  stat3Value: "15+",
  stat3Label: "Partner Organizations",
  stat4Value: "4",
  stat4Label: "Core Pillars",
  
  // About
  aboutBadge: "About Us",
  aboutTitle: "Our Journey Towards A More Peaceful World",
  aboutContent1: "Established in 2023, the Centre for Peace Praxis aims at building communities of hope, healing, and resilience.",
  aboutContent2: "We believe that peace is not just the absence of conflict, but the presence of justice, understanding, and active cooperation. To achieve this, we organize regular workshops, dialogues, and events that spread peace literacy.",
  aboutContent3: "Aligned with our pillars—Media Literacy, Psychosocial Support, Intercultural Dialogue, and Ecological Wellbeing—we create environments where diversity is embraced as a strength.",
  
  // Pillars
  pillarsBadge: "The Foundation",
  pillarsTitle: "Our Core Pillars",
  pillarsDesc: "The foundation of our approach to peacebuilding.",
  pillar1Title: "Intercultural Dialogue",
  pillar1Desc: "Fostering understanding and respect across diverse cultures, beliefs, and backgrounds through open conversations.",
  pillar2Title: "Psycho-social Well-being",
  pillar2Desc: "Supporting mental and emotional health through community-based approaches to healing and resilience.",
  pillar3Title: "Media Literacy",
  pillar3Desc: "Developing critical thinking skills to navigate today's complex media landscape and counter misinformation.",
  pillar4Title: "Eco-consciousness",
  pillar4Desc: "Promoting environmental awareness and sustainable practices as integral components of peace.",
  
  // Upcoming Events Header
  eventsBadge: "Calendar",
  eventsTitle: "Upcoming Events",
  eventsDesc: "Mark your calendars and join us!",
  
  // Event 1
  event1Title: "Inter-Religious Visit",
  event1Date: "20 Feb 2026",
  event1Desc: "A one-day visit to multiple religious institutions including Gurudwara, Mahabodhi, and Dharmaram. Participation from students and faculty.",
  event1Image: "/assets/peaceaxis_image11.jpg",
  
  // Event 2
  event2Title: "Film Festival & Panel Discussion",
  event2Date: "24 Feb 2026",
  event2Desc: "A one-day film screening followed by a panel discussion, scheduled for 24th February 2026.",
  event2Image: "/assets/peaceaxis_image9.jpg",
  
  // Event 3
  event3Title: "Psychosocial Well-being Workshop",
  event3Date: "19 Feb 2026",
  event3Desc: "A 3-hour workshop on “Resilience and Recovery” with e-certificates and student coordinators from each campus.",
  event3Image: "/assets/peaceaxis_image12.jpg",
  
  // Event 4
  event4Title: "SDG Week – NGO Stalls",
  event4Date: "SDG Week",
  event4Desc: "NGO stalls to be set up during SDG Week in the second week of February 2026 to promote sustainable development goals.",
  event4Image: "/assets/peaceaxis_image6.jpg",
  
  // Event 5
  event5Title: "Volunteer in Philippines",
  event5Date: "May 2026",
  event5Desc: "International volunteering opportunity from May 12-31, 2026 at Mindanao Peacebuilding Institute.",
  event5Image: "/assets/volunteer_philippines.jpg",
  
  // Volunteer
  volunteerTitle: "Volunteer With Us",
  volunteerDesc: "Volunteering at the Centre for Peace Praxis is your chance to make a real difference. Through our Christites for Peace program, we train student representatives in the foundations of peacebuilding to lead university-wide peace initiatives.",
  volunteerQuote: "“Peace is hard-earned, intentional, and sustained through listening, inclusion, and hope.”",
  coordinator1Name: "Dr. Padmakumar MM",
  coordinator1Role: "Director, Centre for Peace Praxis",
  coordinator1Image: "/assets/peaceaxis_image5.jpg",
  coordinator2Name: "Ravi Ranjan Sharma",
  coordinator2Role: "Student Coordinator, Centre for Peace Praxis",
  coordinator2Image: "/assets/studentcoordinator.jpg",
  volunteerFormLink: "https://docs.google.com/forms/d/e/1FAIpQLScmjweCQfwquN_aHSy9Tz_DkvodQwyqULN-3AQ19-SfWxP2Lw/viewform?usp=sf_link"
};

const parseEventDate = (dateStr: string): Date => {
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return new Date(parsed);
  
  const lower = dateStr.toLowerCase();
  if (lower.includes("sdg week")) {
    return new Date("2026-02-12"); // mid-Feb 2026 fallback
  }
  if (lower.includes("may 2026")) {
    return new Date("2026-05-01");
  }
  return new Date(9999, 11, 31); // Place unparseable dates at the end
};

export default function Home() {
  const [content] = useState(DEFAULT_CONTENT);
  const [events, setEvents] = useState<any[]>([]);
  const [workshops] = useState<any[]>(staticWorkshops);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any | null>(null);

  useEffect(() => {
    // Record page visit
    fetch("/api/visits", { method: "POST" }).catch(err => console.error(err));

    const fetchEvents = async () => {
      const res = await getEventsAction();
      if (res.success && res.records) {
        const now = new Date();
        const upcoming = res.records.filter((e: any) => new Date(e.date) >= now);
        setEvents(upcoming);
      }
    };
    fetchEvents();
  }, []);

  const features = [
    {
      title: content.feature1Title,
      desc: content.feature1Desc,
      icon: <HeartHandshake className="w-8 h-8 text-primary" />
    },
    {
      title: content.feature2Title,
      desc: content.feature2Desc,
      icon: <GraduationCap className="w-8 h-8 text-primary" />
    },
    {
      title: content.feature3Title,
      desc: content.feature3Desc,
      icon: <Sparkles className="w-8 h-8 text-primary" />
    }
  ];

  const pillars = [
    {
      title: content.pillar1Title,
      desc: content.pillar1Desc,
      icon: <Globe className="w-6 h-6 text-secondary" />
    },
    {
      title: content.pillar2Title,
      desc: content.pillar2Desc,
      icon: <Heart className="w-6 h-6 text-secondary" />
    },
    {
      title: content.pillar3Title,
      desc: content.pillar3Desc,
      icon: <Newspaper className="w-6 h-6 text-secondary" />
    },
    {
      title: content.pillar4Title,
      desc: content.pillar4Desc,
      icon: <Leaf className="w-6 h-6 text-secondary" />
    }
  ];

  const sortedEvents = events;

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
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary" onClick={() => document.getElementById("activities")?.scrollIntoView({ behavior: "smooth" })}>
                View Activities
              </Button>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section id="why" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-4">
                {content.whyTitle}
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mb-4" />
              <p className="text-gray-text text-base sm:text-lg">
                {content.whyDesc}
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
              <span className="text-4xl sm:text-5xl font-extrabold text-light-blue">{content.stat1Value}</span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/80">{content.stat1Label}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-light-blue">{content.stat2Value}</span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/80">{content.stat2Label}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-light-blue">{content.stat3Value}</span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/80">{content.stat3Label}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-light-blue">{content.stat4Value}</span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/80">{content.stat4Label}</span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6 bg-light/30">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">{content.aboutBadge}</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark">
                {content.aboutTitle}
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
              <div className="relative w-full h-[350px] sm:h-[450px]">
                <Image
                  src="/assets/peaceaxis_image1.jpg"
                  alt="Community building praxis event"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="rounded-2xl shadow-xl border border-black/5 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section id="pillars" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">{content.pillarsBadge}</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-4 mt-2">
                {content.pillarsTitle}
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mb-4" />
              <p className="text-gray-text">
                {content.pillarsDesc}
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
              <span className="text-xs font-bold uppercase tracking-wider text-accent">{content.eventsBadge}</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-4 mt-2">
                {content.eventsTitle}
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mb-4" />
              <p className="text-gray-text">
                {content.eventsDesc}
              </p>
            </div>

            {/* Horizontal Scroll or Grid depending on screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.map((evt, idx) => (
                <Card key={idx} className="flex flex-col h-full hover:-translate-y-2 transition-all duration-300">
                  <div className="h-48 relative overflow-hidden bg-primary/10">
                    <Image
                      src={evt.thumbnail_url || evt.image_url || "/assets/peaceaxis_image6.jpg"}
                      alt={evt.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
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
                        {evt.description}
                      </p>
                    </div>
                    <div>
                      {evt.registration_link ? (
                        <a href={evt.registration_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-accent font-bold">
                          Register Now <ArrowRight className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Registration closed</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Activities Catalog Section */}
        <section id="activities" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Portfolio</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-4 mt-2">
                Our Activities
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mb-4" />
              <p className="text-gray-text">
                Engaging, educational, and transformative experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workshops.slice(0, 6).map((w) => {
                const galleryImg = w.gallery?.[0] || "/assets/peaceaxis_image1.jpg";
                const badge = w.badge || "";
                const tag = w.tag || w.category || "Workshop";
                const summary = w.summary || "";
                return (
                  <Link href={`/workshops/${w.slug}`} key={w.slug} className="block h-full group">
                    <Card className="flex flex-col h-full hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                      <div className="h-52 relative overflow-hidden bg-primary/10">
                        <Image
                          src={galleryImg}
                          alt={w.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                        {badge && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-accent to-secondary text-white text-xs font-bold rounded-full shadow-md">
                            {badge}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6 flex-grow flex flex-col justify-between gap-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-bold text-accent uppercase tracking-wider">{tag}</span>
                          <h3 className="text-xl font-display font-bold text-dark group-hover:text-primary transition-colors">
                            {w.title}
                          </h3>
                          <p className="text-gray-text text-sm leading-relaxed line-clamp-4">
                            {summary}
                          </p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-black/5 flex justify-end">
                          <span className="text-sm font-bold text-primary hover:text-accent transition-colors flex items-center gap-1">
                            View Details <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
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
              {content.volunteerTitle}
            </h2>
            <p className="text-lg leading-relaxed text-white/80 max-w-2xl">
              {content.volunteerDesc}
            </p>

            {/* Testimonials Quote */}
            <div className="w-full max-w-xl bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm text-left flex flex-col gap-6">
              <p className="text-base italic text-white/90 leading-relaxed font-serif">
                {content.volunteerQuote}
              </p>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 relative flex-shrink-0">
                    <Image
                      src={content.coordinator1Image}
                      alt={content.coordinator1Name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{content.coordinator1Name}</h4>
                    <p className="text-xs text-white/60">{content.coordinator1Role}</p>
                  </div>
                </div>
                <Link href="/directors-note">
                  <span className="text-xs font-semibold text-secondary hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                    Read note <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>

              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 relative flex-shrink-0">
                  <Image
                    src={content.coordinator2Image}
                    alt={content.coordinator2Name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{content.coordinator2Name}</h4>
                  <p className="text-xs text-white/60">{content.coordinator2Role}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <a
                href={content.volunteerFormLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="accent" size="lg" className="gap-2">
                  Become a Volunteer <Send className="w-4 h-4" />
                </Button>
              </a>
              <Link href="/about#christites">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary gap-2">
                  Christites for Peace Details <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
