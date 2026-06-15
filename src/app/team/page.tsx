"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { User, ExternalLink } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { faculties, students, alumni } from "@/constants/community";

const CATEGORIES = [
  "Faculty Advisors",
  "Students & Volunteers",
  "Alumni Network"
];

export default function TeamPage() {
  const [activeCategory, setActiveCategory] = useState("Faculty Advisors");

  // Get initial letters for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 3)
      .toUpperCase();
  };

  return (
    <>
      <Header />
      <main className="flex-grow pt-[97px] bg-[#fcfcfc]">
        {/* Page Header */}
        <section
          className="relative py-24 px-6 text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85)), url('/assets/volunteer_group.jpg')`,
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Our Team
            </h1>
            <p className="text-lg text-white/80 font-light max-w-xl mx-auto">
              The dedicated educators, students, and alumni behind our praxis.
            </p>
          </div>
        </section>

        {/* Tab selection */}
        <section className="pt-12 px-6 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center border-b border-black/5 pb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm px-5 py-2.5 rounded-xl border font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/15"
                    : "bg-white border-black/5 text-gray-500 hover:border-primary/30 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Members rendering grid */}
        <section className="py-16 px-6 max-w-7xl mx-auto min-h-[50vh]">
          {activeCategory === "Faculty Advisors" && (
            <div className="space-y-12">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-dark mb-2">
                  Faculty Advisors
                </h2>
                <p className="text-sm text-gray-text">Guiding our academic programs and community praxis models.</p>
                <div className="h-1 bg-accent w-12 mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {faculties.map((f, idx) => (
                  <Card key={idx} className="hover:-translate-y-2 transition-all duration-300 flex flex-col h-full justify-between border border-black/5">
                    <div>
                      <div className="h-64 bg-light flex items-center justify-center text-gray-300 overflow-hidden relative">
                        {f.image ? (
                          <Image
                            src={f.image}
                            alt={f.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <User size={48} className="text-black/10" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5 text-center">
                        <h4 className="font-display font-bold text-dark text-base mb-1 truncate" title={f.name}>
                          {f.name}
                        </h4>
                        <p className="text-xs font-semibold text-accent mb-2 truncate" title={f.role}>{f.role}</p>
                        <p className="text-[10px] text-gray-text leading-relaxed line-clamp-2" title={`${f.department}, ${f.campus}`}>
                          {f.department} <br />
                          <span className="text-gray-400">{f.campus}</span>
                        </p>
                      </CardContent>
                    </div>

                    {f.link && (
                      <div className="flex justify-center pb-5 pt-3 border-t border-black/[0.03]">
                        <a
                          href={f.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-accent transition-colors"
                        >
                          View Official Profile <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "Students & Volunteers" && (
            <div className="space-y-12">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-dark mb-2">
                  Student Team & Volunteers
                </h2>
                <p className="text-sm text-gray-text">The core force designing, running, and managing the praxis activities.</p>
                <div className="h-1 bg-accent w-12 mx-auto mt-4" />
              </div>

              {/* Student Coordinators */}
              {students.filter(s => s.isCoordinator).length > 0 && (
                <div className="space-y-6">
                  <span className="block text-center text-xs font-bold uppercase tracking-widest text-accent">
                    Leadership & Coordination
                  </span>
                  <div className="flex flex-wrap gap-8 justify-center">
                    {students.filter(s => s.isCoordinator).map((s, idx) => (
                      <div key={idx} className="w-full max-w-sm">
                        <Card className="border border-black/5 hover:-translate-y-2 transition-all duration-300">
                          <div className="h-80 relative overflow-hidden bg-primary/10">
                            {s.image ? (
                              <Image
                                src={s.image}
                                alt={s.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover object-top"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <User size={64} className="text-black/10" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-6 text-center">
                            <h3 className="text-xl font-display font-bold text-dark mb-1">
                              {s.name}
                            </h3>
                            <p className="text-sm font-semibold text-accent mb-1">{s.role}</p>
                            <p className="text-xs text-gray-400 font-medium">{s.class}</p>

                            {/* Social links */}
                            {(s.linkedin || s.github) && (
                              <div className="flex justify-center gap-4 mt-4">
                                {s.linkedin && (
                                  <a
                                    href={s.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-primary transition-colors"
                                  >
                                    <Linkedin className="w-5 h-5" />
                                  </a>
                                )}
                                {s.github && (
                                  <a
                                    href={s.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-primary transition-colors"
                                  >
                                    <Github className="w-5 h-5" />
                                  </a>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Committee Members & Web Developers */}
              <div className="space-y-6 pt-8 border-t border-black/5">
                <span className="block text-center text-xs font-bold uppercase tracking-widest text-accent">
                  Committee & Working Groups
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {students.filter(s => !s.isCoordinator).map((s, idx) => (
                    <Card key={idx} className="hover:-translate-y-2 transition-all duration-300 flex flex-col h-full justify-between border border-black/5">
                      <div>
                        <div className="h-56 bg-light flex items-center justify-center text-gray-300 overflow-hidden relative">
                          {s.image ? (
                            <Image
                              src={s.image}
                              alt={s.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                              <span className="font-display font-extrabold text-2xl text-gray-400">
                                {getInitials(s.name)}
                              </span>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-5 text-center">
                          <h4 className="font-display font-bold text-dark text-base mb-1 truncate" title={s.name}>
                            {s.name}
                          </h4>
                          <p className="text-xs font-semibold text-accent truncate">{s.role || "Volunteer"}</p>
                          <p className="text-[10px] text-gray-400 mt-1 truncate">{s.class}</p>
                        </CardContent>
                      </div>

                      {/* Footer Social link area */}
                      {(s.linkedin || s.github) && (
                        <div className="flex justify-center gap-3 pb-5 pt-2 border-t border-black/[0.03]">
                          {s.linkedin && (
                            <a
                              href={s.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-primary transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {s.github && (
                            <a
                              href={s.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-primary transition-colors"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeCategory === "Alumni Network" && (
            <div className="space-y-12">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-dark mb-2">
                  Alumni Network
                </h2>
                <p className="text-sm text-gray-text">Graduated student leaders who continue to support the Centre.</p>
                <div className="h-1 bg-accent w-12 mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {alumni.map((a, idx) => (
                  <Card key={idx} className="hover:-translate-y-2 transition-all duration-300 border border-black/5">
                    <div className="h-56 bg-light flex items-center justify-center text-gray-300 overflow-hidden relative">
                      {a.image ? (
                        <Image
                          src={a.image}
                          alt={a.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <User size={48} className="text-black/10" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5 text-center">
                      <h4 className="font-display font-bold text-dark text-base mb-1 truncate" title={a.name}>
                        {a.name}
                      </h4>
                      <p className="text-xs font-semibold text-accent">Alumni Member</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
