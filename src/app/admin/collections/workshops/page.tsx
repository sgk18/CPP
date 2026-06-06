"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Pencil, Trash2, Search, X, Save, Loader2, ImageIcon, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Workshop = {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  duration: string;
  image_url: string;
  category: string;
  registration_link: string;
  status: "active" | "archived";
};

function WorkshopForm({ workshop, onSave, onCancel }: {
  workshop: Partial<Workshop>;
  onSave: (w: Partial<Workshop>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Workshop>>({ status: "active", ...workshop });
  const [saving, setSaving] = useState(false);

  const f = (label: string, key: keyof Workshop, type = "text", hint?: string) => (
    <div>
      <label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
      <input type={type} value={(form[key] as string) ?? ""}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all" />
      {hint && <p className="text-white/20 text-[10px] mt-1">{hint}</p>}
    </div>
  );

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="bg-[#0d1f2d]/80 backdrop-blur border border-[#2a9d8f]/30 rounded-2xl p-6 mb-4">
      <h3 className="text-white font-semibold text-sm mb-5">{workshop.id ? "Edit Workshop" : "New Workshop"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {f("Workshop Title", "title")}
        {f("URL Slug", "slug", "text", "Auto-generated if blank")}
        <div className="sm:col-span-2">
          <label className="block text-white/50 text-xs font-medium mb-1.5">Description</label>
          <textarea rows={3} value={form.description ?? ""}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all resize-none" />
        </div>
        {f("Date", "date", "text")}
        {f("Duration", "duration")}
        {f("Image Path / URL", "image_url")}
        {f("Category", "category")}
        {f("Registration Link", "registration_link", "url")}
        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Status</label>
          <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Workshop["status"] }))}
            className="w-full bg-[#060e14] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none">
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-5">
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all">
          <X size={14} /> Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save Workshop"}
        </button>
      </div>
    </motion.div>
  );
}

export default function WorkshopsManagerPage() {
  const [items, setItems] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<Workshop> | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    setLoading(true);
    const { data } = await supabase.from("workshops").select("*").order("created_at", { ascending: false });
    if (data) setItems(data as Workshop[]);
    setLoading(false);
  };

  const filtered = items.filter(w =>
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    w.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (w: Partial<Workshop>) => {
    if (w.id) {
      // Update
      const { data, error } = await supabase.from("workshops").update(w).eq("id", w.id).select().single();
      if (!error && data) {
        setItems(prev => prev.map(x => x.id === data.id ? data as Workshop : x));
      }
    } else {
      // Insert
      const slug = w.slug || w.title?.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);
      const { data, error } = await supabase.from("workshops").insert({ ...w, slug }).select().single();
      if (!error && data) {
        setItems(prev => [data as Workshop, ...prev]);
      }
    }
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this workshop?")) return;
    setDeleting(id);
    const { error } = await supabase.from("workshops").delete().eq("id", id);
    if (!error) {
      setItems(prev => prev.filter(w => w.id !== id));
    }
    setDeleting(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <BookOpen size={18} className="text-[#2a9d8f]" /> Workshop Manager
          </h2>
          <p className="text-white/35 text-xs mt-0.5">{items.length} workshops · {items.filter(w => w.status === "active").length} active</p>
        </div>
        <button onClick={() => setEditing({})}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg">
          <Plus size={16} /> Add Workshop
        </button>
      </div>

      <AnimatePresence>
        {editing !== null && <WorkshopForm workshop={editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
      </AnimatePresence>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workshops..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/50 transition-all" />
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((w, i) => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04 }}
              className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-white/[0.12] transition-all">
              <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden bg-white/[0.03] border border-white/[0.07]">
                {w.image_url ? <img src={w.image_url} alt={w.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={18} className="text-white/20" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-semibold text-sm">{w.title}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${w.status === "active" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-white/30 bg-white/5 border-white/10"}`}>
                    {w.status}
                  </span>
                  <span className="text-[10px] text-white/30 bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded-full">{w.category}</span>
                </div>
                <p className="text-[#2a9d8f] text-xs mt-0.5">{w.date}{w.duration ? ` · ${w.duration}` : ""}</p>
                <p className="text-white/35 text-xs mt-1 truncate">{w.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {w.registration_link && (
                  <a href={w.registration_link} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-[#2a9d8f] transition-colors">
                    <ExternalLink size={14} />
                  </a>
                )}
                <button onClick={() => setEditing(w)}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-white/80 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(w.id)} disabled={deleting === w.id}
                  className="w-8 h-8 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center justify-center text-rose-400/40 hover:text-rose-400 transition-all">
                  {deleting === w.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 text-white/25">
            <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No workshops found</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-16 text-white/25">
            <Loader2 size={32} className="mx-auto mb-3 opacity-30 animate-spin" />
            <p className="text-sm">Loading workshops...</p>
          </div>
        )}
      </div>
    </div>
  );
}
