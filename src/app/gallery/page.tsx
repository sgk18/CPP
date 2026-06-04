"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/ui/Modal";
import { galleryItems } from "@/constants/gallery";
import { ZoomIn } from "lucide-react";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAlt, setSelectedAlt] = useState<string>("");

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage(src);
    setSelectedAlt(alt);
  };

  return (
    <>
      <Header />
      <main className="flex-grow pt-[97px] bg-[#fcfcfc]">
        {/* Page Header */}
        <section
          className="relative py-24 px-6 text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85)), url('/assets/role_of_religious_bg.jpg')`
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Our Gallery
            </h1>
            <p className="text-lg text-white/80 font-light max-w-xl mx-auto">
              Capturing moments of hope, healing, and community connection.
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleImageClick(item.src, item.alt)}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-md shadow-black/[0.03] border border-black/5 bg-light/30 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/[0.08]"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                  <p className="text-white text-xs font-semibold uppercase tracking-wider mt-2 line-clamp-2">
                    {item.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lightbox Modal */}
        <Modal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          title={selectedAlt}
          size="lg"
        >
          {selectedImage && (
            <div className="w-full flex justify-center items-center rounded-2xl overflow-hidden bg-black/5">
              <img
                src={selectedImage}
                alt={selectedAlt}
                className="max-w-full max-h-[70vh] object-contain rounded-2xl"
              />
            </div>
          )}
        </Modal>
      </main>
      <Footer />
    </>
  );
}
