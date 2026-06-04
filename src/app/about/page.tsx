"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Globe, Heart, Compass, Shield } from "lucide-react";

export default function About() {
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
                  Building Communities of Hope, Healing, and Resilience
                </h2>
                <div className="h-1 bg-accent w-12" />
                <div className="text-gray-text text-base leading-relaxed flex flex-col gap-4">
                  <p className="font-semibold text-primary">
                    Established in 2023, the Centre for Peace Praxis is grounded in the belief that peace is not merely a slogan, but a practice to be cultivated.
                  </p>
                  <p>
                    We believe that peace is not just the absence of conflict, but the presence of active justice, mutual understanding, and cooperation. To achieve this, we organize regular workshops, dialogues, and community projects that spread peace literacy and media critique.
                  </p>
                  <p>
                    Aligned with our pillars—Media Literacy, Psychosocial Support, Intercultural Dialogue, and Ecological Wellbeing—we create environments where differences are embraced as strengths. We equip young leaders with the skills, values, and knowledge needed to become agents of positive social change.
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
                  <h3 className="text-2xl font-display font-bold text-primary">Vision</h3>
                  <p className="text-gray-text text-base leading-relaxed">
                    To be a catalyst for building inclusive, just, and peaceful communities through education, dialogue, and collaborative action across local and global spheres.
                  </p>
                </CardContent>
              </Card>

              <Card hoverEffect={false} className="border border-black/5 bg-light/30">
                <CardContent className="p-8 flex flex-col gap-4">
                  <h3 className="text-2xl font-display font-bold text-primary">Mission</h3>
                  <p className="text-gray-text text-base leading-relaxed">
                    Empowering individuals and institutions with the practical skills, ethical clarity, critical knowledge, and core values necessary for seeking peace and leading social transformation.
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
      </main>
      <Footer />
    </>
  );
}
