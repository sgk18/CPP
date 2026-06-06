"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  ImageIcon, Trash2, Star, GripVertical,
  Upload, Loader2, Search, X, Check, Link as LinkIcon, Pencil
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type GalleryImage = {
  id: string;
  url: string;
  caption: string;
  album: string;
  is_featured: boolean;
  sort_order: number;
};

const ALBUMS = ["All", "Events", "Workshops", "Leadership", "Volunteers", "General"];

export default function GalleryManagerPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumFilter, setAlbumFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editCaption, setEditCaption] = useState<{ id: string; val: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data } = await supabase.from("gallery").select("*").order("sort_order", { ascending: true });
    if (data) setImages(data as GalleryImage[]);
    setLoading(false);
  };

  const filtered = images.filter(img =>
    (albumFilter === "All" || img.album === albumFilter) &&
    (img.caption || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleReorder = async (newOrder: GalleryImage[]) => {
    setImages(newOrder);
    // Background sync
    const updates = newOrder.map((img, index) => ({ id: img.id, sort_order: index }));
    await supabase.from("gallery").upsert(updates);
  };

  const toggleFeatured = async (id: string) => {
    const img = images.find(x => x.id === id);
    if (!img) return;
    const newVal = !img.is_featured;
    setImages(prev => prev.map(x => x.id === id ? { ...x, is_featured: newVal } : x));
    await supabase.from("gallery").update({ is_featured: newVal }).eq("id", id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this image?")) return;
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (!error) setImages(prev => prev.filter(x => x.id !== id));
  };

  const saveCaption = async (id: string) => {
    if (!editCaption) return;
    setImages(prev => prev.map(x => x.id === id ? { ...x, caption: editCaption.val } : x));
    await supabase.from("gallery").update({ caption: editCaption.val }).eq("id", id);
    setEditCaption(null);
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <ImageIcon size={18} className="text-[#2a9d8f]" /> Gallery Manager
          </h2>
          <p className="text-white/35 text-xs mt-0.5">Manage and reorder site images</p>
        </div>
        <button disabled={uploading}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Uploading..." : "Upload New Images"}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto">
          {ALBUMS.map(a => (
            <button key={a} onClick={() => setAlbumFilter(a)}
              className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${albumFilter === a
                ? "bg-[#1A5F7A]/30 border-[#2a9d8f]/40 text-[#2a9d8f]"
                : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70"}`}>
              {a}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search captions..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/50 transition-all" />
        </div>
      </div>

      <div className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-4 min-h-[400px]">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-white/20">
            <Loader2 size={32} className="animate-spin mb-3" />
            <p className="text-sm">Loading gallery...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-white/20">
            <ImageIcon size={32} className="mb-3 opacity-30" />
            <p className="text-sm">No images found.</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={images} onReorder={handleReorder} className="space-y-3">
            {filtered.map(img => (
              <Reorder.Item key={img.id} value={img}
                className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 flex flex-col sm:flex-row gap-4 group hover:bg-white/[0.04] transition-colors relative cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-3">
                  <div className="text-white/20 group-hover:text-white/40 transition-colors">
                    <GripVertical size={18} />
                  </div>
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-[#060e14] flex-shrink-0 relative">
                    <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                    {img.is_featured && (
                      <div className="absolute top-1 left-1 bg-amber-400 text-amber-950 p-0.5 rounded-md">
                        <Star size={10} className="fill-current" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  {editCaption?.id === img.id ? (
                    <div className="flex items-center gap-2">
                      <input autoFocus value={editCaption.val} onChange={e => setEditCaption({ id: img.id, val: e.target.value })}
                        className="flex-1 bg-[#060e14] border border-[#2a9d8f]/50 rounded-lg px-2 py-1 text-white text-sm outline-none" />
                      <button onClick={() => saveCaption(img.id)} className="w-7 h-7 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded-lg"><Check size={12} /></button>
                      <button onClick={() => setEditCaption(null)} className="w-7 h-7 flex items-center justify-center bg-white/5 text-white/40 rounded-lg"><X size={12} /></button>
                    </div>
                  ) : (
                    <div className="group/caption flex items-center gap-2">
                      <p className="text-white text-sm truncate font-medium">{img.caption || <span className="text-white/20 italic">No caption</span>}</p>
                      <button onClick={() => setEditCaption({ id: img.id, val: img.caption })} className="text-white/0 group-hover/caption:text-white/40 hover:!text-[#2a9d8f] transition-all"><Pencil size={12} /></button>
                    </div>
                  )}
                  <p className="text-white/30 text-[10px] mt-1 flex items-center gap-2">
                    <span className="bg-white/[0.05] px-1.5 py-0.5 rounded-md border border-white/5">{img.album}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 sm:justify-end">
                  <button onClick={() => copyUrl(img.url, img.id)}
                    className="w-8 h-8 rounded-lg border border-white/[0.05] flex items-center justify-center transition-colors text-white/40 hover:text-white hover:bg-white/[0.05]"
                    title="Copy URL">
                    {copiedId === img.id ? <Check size={14} className="text-emerald-400" /> : <LinkIcon size={14} />}
                  </button>
                  <button onClick={() => toggleFeatured(img.id)}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${img.is_featured ? "bg-amber-400/10 border-amber-400/20 text-amber-400" : "bg-white/[0.02] border-white/[0.05] text-white/20 hover:text-white/60 hover:bg-white/[0.05]"}`}
                    title={img.is_featured ? "Unfeature" : "Mark as Featured"}>
                    <Star size={14} className={img.is_featured ? "fill-current" : ""} />
                  </button>
                  <button onClick={() => handleDelete(img.id)}
                    className="w-8 h-8 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center justify-center text-rose-400/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
}
