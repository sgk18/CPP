"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon, Upload, Search, Grid3X3, List,
  Trash2, Copy, Check, FolderOpen, Star, X, Loader2
} from "lucide-react";

type MediaItem = {
  id: string;
  name: string;
  src: string;
  size: string;
  category: string;
  featured: boolean;
  uploadedAt: string;
};

const INITIAL_MEDIA: MediaItem[] = [
  { id: "1", name: "peaceaxis_image5.jpg", src: "/assets/peaceaxis_image5.jpg", size: "420 KB", category: "Events", featured: true, uploadedAt: "2024-01-15" },
  { id: "2", name: "peaceaxis_image6.jpg", src: "/assets/peaceaxis_image6.jpg", size: "380 KB", category: "Events", featured: false, uploadedAt: "2024-01-16" },
  { id: "3", name: "peaceaxis_image9.jpg", src: "/assets/peaceaxis_image9.jpg", size: "510 KB", category: "Events", featured: false, uploadedAt: "2024-02-01" },
  { id: "4", name: "peaceaxis_image11.jpg", src: "/assets/peaceaxis_image11.jpg", size: "460 KB", category: "Events", featured: false, uploadedAt: "2024-02-10" },
  { id: "5", name: "peaceaxis_image12.jpg", src: "/assets/peaceaxis_image12.jpg", size: "390 KB", category: "Events", featured: false, uploadedAt: "2024-02-12" },
  { id: "6", name: "volunteer_philippines.jpg", src: "/assets/volunteer_philippines.jpg", size: "650 KB", category: "Volunteers", featured: true, uploadedAt: "2024-03-01" },
  { id: "7", name: "studentcoordinator.jpg", src: "/assets/studentcoordinator.jpg", size: "280 KB", category: "Team", featured: false, uploadedAt: "2024-03-05" },
  { id: "8", name: "current_logo.png", src: "/assets/current_logo.png", size: "92 KB", category: "Branding", featured: true, uploadedAt: "2023-01-01" },
];

const CATEGORIES = ["All", "Events", "Volunteers", "Team", "Branding", "Gallery"];

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = media.filter(m =>
    (category === "All" || m.category === category) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newItems: MediaItem[] = files.map(f => ({
      id: Date.now().toString() + f.name,
      name: f.name,
      src: URL.createObjectURL(f),
      size: `${Math.round(f.size / 1024)} KB`,
      category: "Uploads",
      featured: false,
      uploadedAt: new Date().toISOString().split("T")[0],
    }));
    setMedia(prev => [...newItems, ...prev]);
    setUploading(false);
    e.target.value = "";
  };

  const copyPath = (item: MediaItem) => {
    navigator.clipboard.writeText(item.src);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFeatured = (id: string) => {
    setMedia(prev => prev.map(m => m.id === id ? { ...m, featured: !m.featured } : m));
  };

  const deleteSelected = () => {
    if (!confirm(`Delete ${selected.length} item(s)?`)) return;
    setMedia(prev => prev.filter(m => !selected.includes(m.id)));
    setSelected([]);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <FolderOpen size={18} className="text-[#2a9d8f]" /> Media Library
          </h2>
          <p className="text-white/35 text-xs mt-0.5">{media.length} files · Click image to preview</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button onClick={deleteSelected}
              className="flex items-center gap-2 text-sm text-rose-400 border border-rose-500/20 bg-rose-500/10 px-3 py-2 rounded-xl hover:bg-rose-500/20 transition-all">
              <Trash2 size={14} /> Delete ({selected.length})
            </button>
          )}
          <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      </div>

      {/* Upload zone */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className="border-2 border-dashed border-white/[0.08] rounded-2xl p-8 text-center hover:border-[#2a9d8f]/40 hover:bg-[#2a9d8f]/[0.02] transition-all cursor-pointer group"
      >
        <Upload size={24} className="mx-auto mb-2 text-white/20 group-hover:text-[#2a9d8f]/60 transition-colors" />
        <p className="text-white/30 text-sm">Drop files here or click to upload</p>
        <p className="text-white/15 text-xs mt-1">PNG, JPG, WebP, SVG up to 10MB</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/50 transition-all" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${category === cat
                ? "bg-[#1A5F7A]/30 border-[#2a9d8f]/40 text-[#2a9d8f]"
                : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70"}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 gap-1">
          <button onClick={() => setView("grid")}
            className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-[#1A5F7A]/40 text-[#2a9d8f]" : "text-white/30"}`}>
            <Grid3X3 size={14} />
          </button>
          <button onClick={() => setView("list")}
            className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-[#1A5F7A]/40 text-[#2a9d8f]" : "text-white/30"}`}>
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Grid / List */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.03 }}
                className={`relative group rounded-xl overflow-hidden border cursor-pointer transition-all
                  ${selected.includes(item.id) ? "border-[#2a9d8f]/60 ring-2 ring-[#2a9d8f]/30" : "border-white/[0.07] hover:border-white/[0.15]"}`}
                onClick={() => setPreview(item)}
              >
                <div className="aspect-square bg-white/[0.03]">
                  <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <button onClick={e => { e.stopPropagation(); toggleSelect(item.id); }}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all
                        ${selected.includes(item.id) ? "bg-[#2a9d8f] border-[#2a9d8f]" : "bg-white/10 border-white/30"}`}>
                      {selected.includes(item.id) && <Check size={10} className="text-white" />}
                    </button>
                    <button onClick={e => { e.stopPropagation(); toggleFeatured(item.id); }}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all
                        ${item.featured ? "text-amber-400 border-amber-400/50 bg-amber-400/10" : "text-white/40 border-white/20 bg-white/5"}`}>
                      <Star size={10} fill={item.featured ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <button onClick={e => { e.stopPropagation(); copyPath(item); }}
                    className="w-full flex items-center justify-center gap-1 text-[10px] text-white bg-white/10 hover:bg-white/20 py-1 rounded-lg transition-all">
                    {copiedId === item.id ? <><Check size={10} /> Copied!</> : <><Copy size={10} /> Copy path</>}
                  </button>
                </div>
                {item.featured && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded bg-amber-400/80 flex items-center justify-center">
                    <Star size={9} fill="white" className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="bg-[#0d1f2d]/60 border border-white/[0.07] rounded-xl px-4 py-3 flex items-center gap-4 hover:border-white/[0.12] transition-all">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.04] border border-white/[0.07]">
                <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{item.name}</p>
                <p className="text-white/30 text-xs">{item.size} · {item.category} · {item.uploadedAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleFeatured(item.id)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all
                    ${item.featured ? "text-amber-400 border-amber-400/30 bg-amber-400/10" : "text-white/20 border-white/[0.08]"}`}>
                  <Star size={13} fill={item.featured ? "currentColor" : "none"} />
                </button>
                <button onClick={() => copyPath(item)}
                  className="w-7 h-7 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white/70 transition-colors">
                  {copiedId === item.id ? <Check size={13} className="text-[#2a9d8f]" /> : <Copy size={13} />}
                </button>
                <button onClick={() => { if (confirm("Delete?")) setMedia(prev => prev.filter(m => m.id !== item.id)); }}
                  className="w-7 h-7 rounded-lg border border-rose-500/10 bg-rose-500/5 flex items-center justify-center text-rose-400/40 hover:text-rose-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/25">
          <ImageIcon size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No files found</p>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50" onClick={() => setPreview(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-[#0d1f2d] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full pointer-events-auto">
                <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                  <p className="text-white font-medium text-sm truncate">{preview.name}</p>
                  <button onClick={() => setPreview(null)} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
                </div>
                <img src={preview.src} alt={preview.name} className="w-full max-h-[60vh] object-contain bg-black/30" />
                <div className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white/40 text-xs">{preview.size} · {preview.category} · {preview.uploadedAt}</p>
                    <p className="text-[#2a9d8f] text-xs mt-0.5 font-mono">{preview.src}</p>
                  </div>
                  <button onClick={() => copyPath(preview)}
                    className="flex items-center gap-2 text-xs text-white/50 hover:text-white border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 rounded-xl transition-all flex-shrink-0">
                    {copiedId === preview.id ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy path</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
