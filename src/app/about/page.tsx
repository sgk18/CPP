"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Globe, Heart, Compass, Shield, Newspaper, Leaf, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

export default function About() {
  const [content, setContent] = useState(DEFAULT);

  useEffect(() => {
    const fetchContent = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("pages").select("content").eq("slug", "about").single();
      if (data && data.content) {
        setContent(data.content as typeof DEFAULT);
      }
    };
    fetchContent();
  }, []);

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
                <img
                  src="/assets/peaceaxis_image1.jpg"
                  alt="Community building and dialogue praxis"
                  className="w-full h-auto rounded-2xl shadow-xl border border-black/5"
                />
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
      </main>
      <Footer />
    </>
  );
}
