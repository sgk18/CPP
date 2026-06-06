"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  ImageIcon, Plus, Trash2, Star, GripVertical,
  Upload, Loader2, Search, FolderPlus, X, Check
} from "lucide-react";

type GalleryImage = {
  id: string;
  src: string;
  caption: string;
  album: string;
  featured: boolean;
  order: number;
};

const INITIAL: GalleryImage[] = [
  { id: "1", src: "/assets/peaceaxis_image5.jpg", caption: "Director addressing participants", album: "Leadership", featured: true, order: 1 },
  { id: "2", src: "/assets/peaceaxis_image6.jpg", caption: "SDG Week NGO Stalls", album: "Events", featured: false, order: 2 },
  { id: "3", src: "/assets/peaceaxis_image9.jpg", caption: "Film Festival Panel", album: "Events", featured: true, order: 3 },
  { id: "4", src: "/assets/peaceaxis_image11.jpg", caption: "Inter-Religious Visit", album: "Events", featured: false, order: 4 },
  { id: "5", src: "/assets/peaceaxis_image12.jpg", caption: "Psychosocial Workshop", album: "Events", featured: false, order: 5 },
  { id: "6", src: "/assets/volunteer_philippines.jpg", caption: "Philippines Volunteering Program", album: "Volunteers", featured: true, order: 6 },
];

const ALBUMS = ["All", "Events", "Volunteers", "Leadership", "Workshops"];

export default function GalleryManagerPage() {
  const [images, setImages] = useState<GalleryImage[]>(INITIAL);
  const [album, setAlbum] = useState("All");
  const [search, setSearch] = useState("");
  const [newAlbum, setNewAlbum] = useState("");
  const [showAlbumInput, setShowAlbumInput] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editCaption, setEditCaption] = useState<{ id: string; val: string } | null>(null);

  const filtered = images.filter(img =>
    (album === "All" || img.album === album) &&
    img.caption.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 900));
    const next = images.length;
    const added: GalleryImage[] = files.map((f, i) => ({
      id: Date.now() + "" + i,
      src: URL.createObjectURL(f),
      caption: f.name.replace(/\.[^.]+$/, ""),
      album: album === "All" ? "Uploads" : album,
      featured: false,
      order: next + i + 1,
    }));
    setImages(prev => [...prev, ...added]);
    setUploading(false);
    e.target.value = "";
  };

  const toggleFeatured = (id: string) =>
    setImages(prev => prev.map(img => img.id === id ? { ...img, featured: !img.featured } : img));

  const deleteImage = async (id: string) => {
    if (!confirm("Remove this image from gallery?")) return;
    setDeleting(id);
    await new Promise(r => setTimeout(r, 400));
    setImages(prev => prev.filter(img => img.id !== id));
    setDeleting(null);
  };

  const saveCaption = () => {
    if (!editCaption) return;
    setImages(prev => prev.map(img => img.id === editCaption.id ? { ...img, caption: editCaption.val } : img));
    setEditCaption(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <ImageIcon size={18} className="text-[#2a9d8f]" /> Gallery Manager
          </h2>
          <p className="text-white/35 text-xs mt-0.5">
            {images.length} images · {images.filter(i => i.featured).length} featured · Drag to reorder
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading..." : "Upload Images"}
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Albums row */}
      <div className="flex flex-wrap items-center gap-2">
        {ALBUMS.map(a => (
          <button key={a} onClick={() => setAlbum(a)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${album === a
              ? "bg-[#1A5F7A]/30 border-[#2a9d8f]/40 text-[#2a9d8f]"
              : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70"}`}>
            {a}
          </button>
        ))}
        {showAlbumInput ? (
          <div className="flex items-center gap-2">
            <input autoFocus value={newAlbum} onChange={e => setNewAlbum(e.target.value)}
              placeholder="Album name"
              onKeyDown={e => { if (e.key === "Enter" && newAlbum.trim()) { setShowAlbumInput(false); setNewAlbum(""); } }}
              className="bg-white/[0.04] border border-[#2a9d8f]/40 rounded-lg px-3 py-1.5 text-white text-xs outline-none w-32" />
            <button onClick={() => setShowAlbumInput(false)} className="text-white/30 hover:text-white/70"><X size={14} /></button>
          </div>
        ) : (
          <button onClick={() => setShowAlbumInput(true)}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-[#2a9d8f] transition-colors border border-dashed border-white/[0.08] px-3 py-1.5 rounded-lg">
            <FolderPlus size={12} /> New Album
          </button>
        )}

        {/* Search */}
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-white text-xs outline-none focus:border-[#2a9d8f]/50 transition-all w-40" />
        </div>
      </div>

      {/* Drag-to-reorder grid */}
      <Reorder.Group
        axis="y"
        values={filtered}
        onReorder={(newOrder) => {
          setImages(prev => {
            const ids = new Set(newOrder.map(i => i.id));
            const others = prev.filter(i => !ids.has(i.id));
            return [...others, ...newOrder];
          });
        }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        as="div"
      >
        <AnimatePresence>
          {filtered.map((img) => (
            <Reorder.Item key={img.id} value={img} as="div">
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="group relative rounded-xl overflow-hidden border border-white/[0.07] hover:border-white/[0.15] transition-all bg-white/[0.02] cursor-grab active:cursor-grabbing"
              >
                <div className="aspect-square">
                  <img src={img.src} alt={img.caption} className="w-full h-full object-cover" />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start">
                    <div className="text-white/40 hover:text-white/80 transition-colors">
                      <GripVertical size={16} />
                    </div>
                    <button onClick={() => toggleFeatured(img.id)}
                      className={`w-6 h-6 rounded border flex items-center justify-center transition-all
                        ${img.featured ? "text-amber-400 border-amber-400/50 bg-amber-400/10" : "text-white/40 border-white/20 bg-black/20"}`}>
                      <Star size={11} fill={img.featured ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {editCaption?.id === img.id ? (
                      <div className="flex gap-1">
                        <input autoFocus value={editCaption.val}
                          onChange={e => setEditCaption({ id: img.id, val: e.target.value })}
                          onKeyDown={e => e.key === "Enter" && saveCaption()}
                          className="flex-1 bg-black/50 border border-white/20 rounded-lg px-2 py-1 text-white text-[10px] outline-none" />
                        <button onClick={saveCaption} className="text-[#2a9d8f]"><Check size={12} /></button>
                      </div>
                    ) : (
                      <p onClick={() => setEditCaption({ id: img.id, val: img.caption })}
                        className="text-white text-[10px] truncate cursor-text hover:text-[#2a9d8f] transition-colors" title="Click to edit">
                        {img.caption}
                      </p>
                    )}
                    <button onClick={() => deleteImage(img.id)} disabled={deleting === img.id}
                      className="w-full flex items-center justify-center gap-1 text-[10px] text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 py-1 rounded-lg transition-all">
                      {deleting === img.id ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
                      {deleting === img.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>

                {img.featured && (
                  <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded bg-amber-400/80 flex items-center justify-center shadow">
                    <Star size={10} fill="white" className="text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 group-hover:hidden">
                  <p className="text-white/60 text-[10px] truncate">{img.caption}</p>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/20">
          <ImageIcon size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No images in this album</p>
          <p className="text-xs mt-1">Upload images or switch album</p>
        </div>
      )}
    </div>
  );
}
