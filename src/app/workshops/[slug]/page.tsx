"use client";

import React, { useState, use } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { workshops } from "@/constants/workshops";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ZoomIn,
  ArrowLeft,
  Award,
  Target
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function WorkshopReport({ params }: PageProps) {
  const { slug } = use(params);
  const workshop = workshops.find((w) => w.slug === slug);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!workshop) {
    notFound();
  }

  // Get initial letters for avatar placeholder
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
        {/* Event Hero */}
        <section
          className="relative min-h-[50vh] flex flex-col justify-center py-20 px-6 text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(26, 95, 122, 0.85), rgba(42, 157, 143, 0.8)), url('${workshop.gallery[0]}')`
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 animate-fade-in-up">
            <span className="px-4 py-1.5 bg-accent text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md">
              {workshop.tag}
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              {workshop.title}
            </h1>
            {workshop.subtitle && (
              <h2 className="text-xl sm:text-2xl font-display font-light text-light-blue">
                {workshop.subtitle}
              </h2>
            )}

            {/* Event Metadata Blocks */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm text-sm">
                <Calendar className="w-4 h-4 text-accent" />
                <span>{workshop.date}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm text-sm">
                <Clock className="w-4 h-4 text-accent" />
                <span>{workshop.time}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm text-sm">
                <MapPin className="w-4 h-4 text-accent" />
                <span>{workshop.location}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Report Content */}
        <section className="py-20 px-6 max-w-4xl mx-auto flex flex-col gap-16">
          
          {/* Back to Home Link */}
          <div>
            <Link href="/#activities" className="inline-flex items-center gap-2 text-xs font-bold tracking-wide uppercase text-gray-text hover:text-primary transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Activities
            </Link>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-display font-bold text-primary relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-accent">
              Summary of the Activity
            </h3>
            <p className="text-gray-text text-base sm:text-lg leading-relaxed text-justify mt-2">
              {workshop.summary}
            </p>
          </div>

          {/* Image Divider (if Bridging Hearts or similar has an inline poster) */}
          {workshop.slug === "bridging-hearts" && (
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-black/5 max-w-2xl mx-auto">
              <img
                src="/assets/bridging_hearts_poster.jpg"
                alt="Bridging Hearts Workshop Poster"
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Highlights */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-display font-bold text-primary relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-accent">
              Highlights of the Activity
            </h3>
            <p className="text-gray-text text-base sm:text-lg leading-relaxed text-justify mt-2 whitespace-pre-line">
              {workshop.highlights}
            </p>
          </div>

          {/* Speakers Section */}
          {workshop.speakers.length > 0 && (
            <div className="py-6 border-y border-black/5">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-display font-bold text-dark">
                  {workshop.speakers.length === 1 ? "Featured Speaker" : "Distinguished Panelists"}
                </h3>
                <p className="text-sm text-gray-text mt-1">Guiding the conversations and peace praxis models</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
                {workshop.speakers.map((spk, idx) => (
                  <Card key={idx} className="flex flex-col h-full bg-light/20 hover:-translate-y-1.5 transition-all duration-300">
                    <CardContent className="p-6 text-center flex flex-col items-center gap-4 flex-grow">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary/10 flex items-center justify-center border-2 border-secondary/25 shadow-inner">
                        {spk.image ? (
                          <img src={spk.image} alt={spk.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-display font-extrabold text-lg text-secondary">
                            {getInitials(spk.name)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <h4 className="font-display font-bold text-dark text-base leading-tight">
                          {spk.name}
                        </h4>
                        <p className="text-xs font-semibold text-accent leading-relaxed">
                          {spk.role}
                        </p>
                        <p className="text-xs text-gray-text font-medium">
                          {spk.org}
                        </p>
                      </div>

                      {spk.presentation && (
                        <div className="w-full border-t border-black/5 pt-4 mt-auto">
                          <p className="text-[10px] font-bold text-gray-text/60 uppercase tracking-wider mb-1">Presentation</p>
                          <p className="text-xs italic text-dark font-medium leading-relaxed">
                            &ldquo;{spk.presentation}&rdquo;
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-display font-bold text-primary relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-accent">
              Key Takeaways
            </h3>
            <div className="bg-primary/5 border-l-4 border-primary rounded-r-2xl p-6 flex flex-col gap-4 mt-2">
              <ul className="flex flex-col gap-4 list-none p-0 m-0 text-gray-text">
                {workshop.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base leading-relaxed text-justify text-dark/95">
                      {takeaway}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Impact Stats Section */}
          {workshop.stats && workshop.stats.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              {workshop.stats.map((stat, idx) => {
                const IconComponent = idx === 0 ? Users : idx === 1 ? Award : Target;
                return (
                  <div key={idx} className="py-12 bg-primary text-white rounded-3xl text-center px-6 flex flex-col items-center gap-1 shadow-lg shadow-primary/20">
                    <IconComponent className="w-8 h-8 text-light-blue mb-2" />
                    <h3 className="text-4xl font-extrabold text-light-blue">{stat.value}</h3>
                    <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/80">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 bg-primary text-white rounded-3xl text-center px-6 flex flex-col items-center gap-1 shadow-lg shadow-primary/20">
              <Users className="w-8 h-8 text-light-blue mb-2" />
              <h3 className="text-4xl font-extrabold text-light-blue">{workshop.participants}</h3>
              <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/80">Active Participants</p>
            </div>
          )}

          {/* Event Gallery */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-display font-bold text-primary relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-accent text-center mb-6">
              Event Gallery
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {workshop.gallery.map((imgSrc, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(imgSrc)}
                  className="group relative h-48 rounded-xl overflow-hidden shadow-md border border-black/5 bg-light/30 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <img src={imgSrc} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SDG Alignments */}
          <div className="pt-10 border-t border-black/5 flex flex-col items-center gap-6">
            <span className="text-[10px] font-bold text-gray-text uppercase tracking-widest">Alignment with UN SDGs</span>
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-2xl">
              {workshop.sdgs.map((sdg, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white border border-black/5 rounded-2xl px-6 py-4 shadow-sm w-full sm:w-auto flex-grow justify-center"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent text-white font-extrabold text-2xl font-display shadow-md shadow-accent/20">
                    {sdg.number}
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-gray-text uppercase tracking-wider mb-0.5">Sustainable Goal</p>
                    <p className="text-sm font-bold text-dark leading-tight">{sdg.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Lightbox Modal */}
        <Modal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          title="Event Photo Box"
          size="lg"
        >
          {selectedImage && (
            <div className="w-full flex justify-center items-center bg-black/5 rounded-2xl">
              <img
                src={selectedImage}
                alt="Event Gallery Zoom"
                className="max-w-full max-h-[70vh] object-contain rounded-xl"
              />
            </div>
          )}
        </Modal>
      </main>
      <Footer />
    </>
  );
}
