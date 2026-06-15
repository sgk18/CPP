"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/ui/Modal";
import { getGalleryAction } from "@/lib/actions/gallery";
import { ZoomIn, Loader2 } from "lucide-react";
import Image from "next/image";

type GalleryItem = {
  id: string;
  url: string;
  thumbnail_url?: string;
  medium_url?: string;
  caption: string;
  album: string;
  is_featured: boolean;
  sort_order: number;
};

const ALBUMS = ["All", "Events", "Workshops", "Leadership", "Volunteers", "General"];

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumFilter, setAlbumFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1024 / 683);

  useEffect(() => {
    const fetchGallery = async () => {
      const res = await getGalleryAction();
      if (res.success && res.records) {
        setItems(res.records as GalleryItem[]);
      }
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const filtered = items.filter(item =>
    albumFilter === "All" || item.album === albumFilter
  );

  return (
    <>
      <Header />
      <main className="flex-grow pt-[97px] bg-[#fcfcfc]">
        {/* Page Header */}
        <section
          className="relative w-full flex flex-col justify-center items-center px-6 text-center text-white overflow-hidden isolate min-h-[300px]"
          style={{ aspectRatio: aspectRatio }}
        >
          {/* Main image: resizes dynamically to fit aspect ratio */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="/assets/role_of_religious_bg.jpg"
              alt="Our Gallery"
              fill
              className="object-cover object-center"
              priority
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                if (img.naturalWidth && img.naturalHeight) {
                  setAspectRatio(img.naturalWidth / img.naturalHeight);
                }
              }}
            />
          </div>
          {/* Gradient overlay for text contrast */}
          <div 
            className="absolute inset-0 -z-[5]"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85))`
            }}
          />
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Our Gallery
            </h1>
            <p className="text-lg text-white/80 font-light max-w-xl mx-auto">
              Capturing moments of hope, healing, and community connection.
            </p>
          </div>
        </section>

        {/* Album Filters */}
        <section className="pt-10 px-6 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {ALBUMS.map(a => (
              <button
                key={a}
                onClick={() => setAlbumFilter(a)}
                className={`text-sm px-4 py-2 rounded-full border font-medium transition-all ${
                  albumFilter === a
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-black/10 text-gray-500 hover:border-primary hover:text-primary"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-10 px-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm">Loading gallery...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-sm">No images found in this album.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-md shadow-black/[0.03] border border-black/5 bg-light/30 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/[0.08]"
                >
                  <Image
                    src={item.thumbnail_url || item.url}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {item.is_featured && (
                    <div className="absolute top-3 left-3 bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Featured
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                    <p className="text-white text-xs font-semibold uppercase tracking-wider mt-2 line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Lightbox Modal */}
        <Modal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          title={selectedImage?.caption ?? ""}
          size="lg"
        >
          {selectedImage && (
            <div className="w-full flex flex-col items-center gap-3 rounded-2xl overflow-hidden bg-black/5 p-2">
              <Image
                src={selectedImage.medium_url || selectedImage.url}
                alt={selectedImage.caption}
                width={1200}
                height={800}
                sizes="(max-width: 1200px) 100vw, 1200px"
                style={{ width: "100%", height: "auto", maxHeight: "70vh" }}
                className="object-contain rounded-2xl"
                priority
              />
              {selectedImage.album && (
                <span className="text-xs text-gray-400 font-medium px-3 py-1 bg-gray-100 rounded-full mt-2">
                  {selectedImage.album}
                </span>
              )}
            </div>
          )}
        </Modal>
      </main>
      <Footer />
    </>
  );
}
