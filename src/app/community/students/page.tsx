"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { students } from "@/constants/community";
import { User, Code } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";

export default function Students() {
  const coordinator = students.find((s) => s.isCoordinator);
  const coreCommittee = students.filter((s) => s.role === "Core Committee");
  const developers = students.filter((s) => s.role === "Web Developer");

  return (
    <>
      <Header />
      <main className="flex-grow pt-[97px] bg-[#fcfcfc]">
        {/* Page Header */}
        <section
          className="relative py-24 px-6 text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85)), url('/assets/volunteer_group.jpg')`,
            backgroundAttachment: "fixed"
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Meet Our Students
            </h1>
            <p className="text-lg text-white/80 font-light max-w-xl mx-auto">
              The hearts and hands behind our mission for peace and resilience.
            </p>
          </div>
        </section>

        <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col gap-24">
          
          {/* Coordinator Section */}
          {coordinator && (
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-accent mb-6">Student Leadership</span>
              <div className="w-full max-w-sm">
                <Card className="hover:-translate-y-2 transition-all duration-300">
                  <div className="h-80 relative overflow-hidden bg-primary/10">
                    <img
                      src={coordinator.image || "https://ui-avatars.com/api/?name=Coordinator&background=random"}
                      alt={coordinator.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-display font-bold text-dark mb-1">
                      {coordinator.name}
                    </h3>
                    <p className="text-sm font-semibold text-accent mb-1">{coordinator.role}</p>
                    <p className="text-xs text-gray-text font-medium mb-1">{coordinator.class}</p>
                    <p className="text-xs text-gray-text italic">Christ University</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Core Committee Section */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-dark mb-2">
                Core Committee Members
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {coreCommittee.map((s, idx) => (
                <Card key={idx} className="hover:-translate-y-2 transition-all duration-300">
                  <div className="h-56 bg-light flex items-center justify-center text-gray-300">
                    {s.image ? (
                      <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-black/10" />
                    )}
                  </div>
                  <CardContent className="p-6 text-center">
                    <h4 className="font-display font-bold text-dark text-base mb-1">
                      {s.name}
                    </h4>
                    <p className="text-xs font-semibold text-accent mb-2">{s.role}</p>
                    <p className="text-xs text-gray-text leading-relaxed font-medium">{s.class}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Web Developers Section */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-dark mb-2">
                Web Developers
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {developers.map((d, idx) => (
                <Card key={idx} className="hover:-translate-y-2 transition-all duration-300">
                  <div className="h-60 relative bg-light flex items-center justify-center text-gray-300">
                    {d.image ? (
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-primary/30">
                        <Code className="w-16 h-16" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 text-center flex flex-col items-center gap-4">
                    <div>
                      <h4 className="font-display font-bold text-dark text-base mb-1">
                        {d.name}
                      </h4>
                      <p className="text-xs text-gray-text leading-relaxed font-semibold">{d.class}</p>
                    </div>
                    {/* Dev Links */}
                    <div className="flex items-center justify-center gap-4 mt-2">
                      {d.linkedin && (
                        <a
                          href={d.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-text hover:text-secondary hover:scale-110 transition-all duration-200"
                          aria-label={`${d.name} LinkedIn Profile`}
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {d.github && (
                        <a
                          href={d.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-text hover:text-primary hover:scale-110 transition-all duration-200"
                          aria-label={`${d.name} GitHub Profile`}
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </section>
      </main>
      <Footer />
    </>
  );
}
