"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  ImageIcon, Trash2, Star, GripVertical,
  Upload, Loader2, Search, X, Check, Link as LinkIcon, Pencil, ChevronLeft, ChevronRight
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  addGalleryImageAction,
  updateGalleryCaptionAction,
  toggleGalleryFeaturedAction,
  reorderGalleryImagesAction,
  deleteGalleryImageAction,
  getGalleryAction
} from "@/lib/actions/gallery";

type GalleryImage = {
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
const PAGE_SIZE = 12;

export default function GalleryManagerPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumFilter, setAlbumFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Upload modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadAlbum, setUploadAlbum] = useState("General");
  const [uploadCaption, setUploadCaption] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  // Edit states
  const [editCaption, setEditCaption] = useState<{ id: string; val: string } | null>(null);

  async function fetchImages() {
    setLoading(true);
    const res = await getGalleryAction();
    if (res.success && res.records) {
      setImages(res.records as GalleryImage[]);
    } else if (res.error) {
      alert("Error loading gallery: " + res.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchImages();
    });
  }, []);

  // Handle page resets when filters change
  useEffect(() => {
    Promise.resolve().then(() => {
      setCurrentPage(1);
    });
  }, [albumFilter, search]);

  const filtered = images.filter(img =>
    (albumFilter === "All" || img.album === albumFilter) &&
    (img.caption || "").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination bounds
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const handleReorder = async (newOrder: GalleryImage[]) => {
    // If not filtered/searched, we can reorder globally.
    // If filtered, we map the reordered chunk back into the global array.
    let updatedImages = [...images];
    if (albumFilter === "All" && search === "") {
      updatedImages = newOrder;
    } else {
      // Find matching items in global array and replace in their index positions
      const newOrderIds = new Set(newOrder.map(x => x.id));
      let newOrderIndex = 0;
      updatedImages = images.map(img => {
        if (newOrderIds.has(img.id)) {
          return newOrder[newOrderIndex++];
        }
        return img;
      });
    }

    setImages(updatedImages);

    // Sync to database
    const updates = updatedImages.map((img, index) => ({ id: img.id, sort_order: index }));
    await reorderGalleryImagesAction(updates);
  };

  const toggleFeatured = async (id: string) => {
    const img = images.find(x => x.id === id);
    if (!img) return;
    const newVal = !img.is_featured;
    setImages(prev => prev.map(x => x.id === id ? { ...x, is_featured: newVal } : x));
    
    const res = await toggleGalleryFeaturedAction(id, newVal);
    if (!res.success) {
      alert("Error: " + res.error);
      // Revert
      setImages(prev => prev.map(x => x.id === id ? { ...x, is_featured: !newVal } : x));
    }
  };

  const handleDelete = async (id: string, urlPath: string) => {
    if (!confirm("Remove this image?")) return;
    const res = await deleteGalleryImageAction(id, urlPath);
    if (res.success) {
      setImages(prev => prev.filter(x => x.id !== id));
    } else {
      alert("Error: " + res.error);
    }
  };

  const saveCaption = async (id: string) => {
    if (!editCaption) return;
    const oldCaption = images.find(x => x.id === id)?.caption || "";
    setImages(prev => prev.map(x => x.id === id ? { ...x, caption: editCaption.val } : x));

    const res = await updateGalleryCaptionAction(id, editCaption.val);
    if (!res.success) {
      alert("Error: " + res.error);
      setImages(prev => prev.map(x => x.id === id ? { ...x, caption: oldCaption } : x));
    }
    setEditCaption(null);
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    let uploadedCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        const uploadData = await uploadRes.json();

        if (uploadData.success && uploadData.metadata) {
          // File uploaded, now create record in database
          const dbRes = await addGalleryImageAction({
            url: uploadData.metadata.url,
            thumbnail_url: uploadData.metadata.thumbnail,
            medium_url: uploadData.metadata.medium,
            caption: selectedFiles.length === 1 ? uploadCaption : `${uploadCaption} (${i + 1})`,
            album: uploadAlbum,
          });

          if (dbRes.success && dbRes.record) {
            setImages(prev => [...prev, dbRes.record as GalleryImage]);
            uploadedCount++;
          } else {
            console.error("DB Insert error for gallery:", dbRes.error);
          }
        } else {
          console.error("Upload error for file:", file.name, uploadData.error);
        }
      } catch (err) {
        console.error("Upload failed for file:", file.name, err);
      }
    }

    setUploading(false);
    setIsUploadOpen(false);
    setSelectedFiles(null);
    setUploadCaption("");
    alert(`Successfully uploaded ${uploadedCount} image(s) to gallery.`);
    fetchImages(); // Refresh and reorder
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2">
            <ImageIcon size={18} className="text-[#2a9d8f]" /> Gallery Manager
          </h2>
          <p className="text-gray-500 text-xs mt-0.5">Manage, upload, and reorder site images</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg"
        >
          <Upload size={16} /> Upload New Images
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto">
          {ALBUMS.map(a => (
            <button key={a} onClick={() => setAlbumFilter(a)}
              className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${albumFilter === a
                ? "bg-[#1A5F7A]/30 border-gray-300 text-[#2a9d8f]"
                : "bg-gray-50/30 border-gray-200 text-gray-500 hover:text-gray-700"}`}>
              {a}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search captions..."
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-gray-900 text-sm outline-none focus:border-[#2a9d8f]/50 transition-all" />
        </div>
      </div>

      <div className="bg-white backdrop-blur border border-gray-200 rounded-2xl p-4 min-h-[400px] flex flex-col justify-between">
        <div>
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-3" />
              <p className="text-sm">Loading gallery...</p>
            </div>
          ) : paginatedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-gray-400">
              <ImageIcon size={32} className="mb-3 opacity-30" />
              <p className="text-sm">No images found.</p>
            </div>
          ) : (
            <Reorder.Group axis="y" values={paginatedItems} onReorder={handleReorder} className="space-y-3">
              {paginatedItems.map(img => (
                <Reorder.Item key={img.id} value={img}
                  className="bg-gray-50/30 border border-white/[0.05] rounded-xl p-3 flex flex-col sm:flex-row gap-4 group hover:bg-gray-50/50 transition-colors relative cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 group-hover:text-gray-500 transition-colors">
                      <GripVertical size={18} />
                    </div>
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 relative">
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
                          className="flex-1 bg-white border border-[#2a9d8f]/50 rounded-lg px-2 py-1 text-gray-900 text-sm outline-none" />
                        <button onClick={() => saveCaption(img.id)} className="w-7 h-7 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded-lg"><Check size={12} /></button>
                        <button onClick={() => setEditCaption(null)} className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg"><X size={12} /></button>
                      </div>
                    ) : (
                      <div className="group/caption flex items-center gap-2">
                        <p className="text-gray-900 text-sm truncate font-medium">{img.caption || <span className="text-gray-400 italic">No caption</span>}</p>
                        <button onClick={() => setEditCaption({ id: img.id, val: img.caption })} className="text-white/0 group-hover/caption:text-gray-500 hover:!text-[#2a9d8f] transition-all"><Pencil size={12} /></button>
                      </div>
                    )}
                    <p className="text-gray-400 text-[10px] mt-1 flex items-center gap-2">
                      <span className="bg-white/[0.05] px-1.5 py-0.5 rounded-md border border-white/5">{img.album}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 sm:justify-end">
                    <button onClick={() => copyUrl(img.url, img.id)}
                      className="w-8 h-8 rounded-lg border border-white/[0.05] flex items-center justify-center transition-colors text-gray-500 hover:text-white hover:bg-white/[0.05]"
                      title="Copy URL">
                      {copiedId === img.id ? <Check size={14} className="text-emerald-400" /> : <LinkIcon size={14} />}
                    </button>
                    <button onClick={() => toggleFeatured(img.id)}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${img.is_featured ? "bg-amber-400/10 border-amber-400/20 text-amber-400" : "bg-gray-50/30 border-white/[0.05] text-gray-400 hover:text-gray-600 hover:bg-white/[0.05]"}`}
                      title={img.is_featured ? "Unfeature" : "Mark as Featured"}>
                      <Star size={14} className={img.is_featured ? "fill-current" : ""} />
                    </button>
                    <button onClick={() => handleDelete(img.id, img.url)}
                      className="w-8 h-8 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>

        {/* Pagination controls */}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-gray-500 text-xs">
            <p>Showing {startIndex + 1} to {Math.min(startIndex + PAGE_SIZE, filtered.length)} of {filtered.length} images</p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 border border-white/5 rounded-lg flex items-center justify-center hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="w-8 h-8 border border-white/5 rounded-lg flex items-center justify-center hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Images Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Images to Gallery">
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-1">Target Album</label>
            <select
              value={uploadAlbum}
              onChange={e => setUploadAlbum(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2a9d8f] transition-all"
            >
              {ALBUMS.filter(a => a !== "All").map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-1">Image Caption</label>
            <input
              type="text"
              value={uploadCaption}
              onChange={e => setUploadCaption(e.target.value)}
              placeholder="E.g. Peace praxis annual workshop panel"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2a9d8f] transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-1">Select Image File(s)</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#2a9d8f] rounded-2xl p-6 cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs font-medium text-gray-500">
                {selectedFiles && selectedFiles.length > 0
                  ? `${selectedFiles.length} file(s) selected`
                  : "Click to select local images"}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={e => setSelectedFiles(e.target.files)}
                className="hidden"
                required
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setIsUploadOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={uploading || !selectedFiles}>
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                "Start Upload"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
