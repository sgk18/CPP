"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Plus, Pencil, Trash2, Check, X, Save, Loader2, ThumbsUp, ThumbsDown, Search } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  status: "approved" | "pending" | "rejected";
  date: string;
};

const INITIAL: Testimonial[] = [
  { id: "1", name: "Dr. Padmakumar MM", role: "Director, CPP", content: "Peace is hard-earned, intentional, and sustained through listening, inclusion, and hope.", avatar: "/assets/peaceaxis_image5.jpg", status: "approved", date: "2024-01-15" },
  { id: "2", name: "Ravi Ranjan Sharma", role: "Student Coordinator", content: "This program transformed how I see conflict resolution and community building.", avatar: "/assets/studentcoordinator.jpg", status: "approved", date: "2024-02-10" },
  { id: "3", name: "Workshop Participant", role: "Psychosocial Workshop", content: "The resilience workshop gave me tools I use every day. Truly life-changing.", avatar: "", status: "pending", date: "2024-03-01" },
];

const STATUS_COLORS = {
  approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  rejected: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

function TestimonialForm({ item, onSave, onCancel }: { item: Partial<Testimonial>; onSave: (t: Testimonial) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<Testimonial>>({ status: "pending", ...item });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.content) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    onSave({ id: form.id || Date.now().toString(), name: form.name!, role: form.role || "", content: form.content!, avatar: form.avatar || "", status: form.status || "pending", date: form.date || new Date().toISOString().split("T")[0] });
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="bg-[#0d1f2d]/80 backdrop-blur border border-[#2a9d8f]/30 rounded-2xl p-6 mb-4">
      <h3 className="text-white font-semibold text-sm mb-5">{item.id ? "Edit Testimonial" : "Add Testimonial"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["name", "role", "avatar", "date"].map(key => (
          <div key={key}>
            <label className="block text-white/50 text-xs font-medium mb-1.5 capitalize">{key === "avatar" ? "Photo URL" : key}</label>
            <input value={(form[key as keyof Testimonial] as string) ?? ""}
              onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all" />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-white/50 text-xs font-medium mb-1.5">Testimonial Text</label>
          <textarea rows={3} value={form.content ?? ""}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all resize-none" />
        </div>
        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Status</label>
          <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Testimonial["status"] }))}
            className="w-full bg-[#060e14] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-5">
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all">
          <X size={14} /> Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </motion.div>
  );
}

export default function TestimonialsManagerPage() {
  const [items, setItems] = useState<Testimonial[]>(INITIAL);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Testimonial["status"]>("all");

  const filtered = items.filter(t =>
    (filter === "all" || t.status === filter) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase()))
  );

  const approve = (id: string) => setItems(prev => prev.map(t => t.id === id ? { ...t, status: "approved" } : t));
  const reject = (id: string) => setItems(prev => prev.map(t => t.id === id ? { ...t, status: "rejected" } : t));
  const remove = (id: string) => { if (confirm("Delete?")) setItems(prev => prev.filter(t => t.id !== id)); };

  const handleSave = (t: Testimonial) => {
    setItems(prev => {
      const idx = prev.findIndex(x => x.id === t.id);
      if (idx >= 0) { const arr = [...prev]; arr[idx] = t; return arr; }
      return [t, ...prev];
    });
    setEditing(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Quote size={18} className="text-[#2a9d8f]" /> Testimonials Manager
          </h2>
          <p className="text-white/35 text-xs mt-0.5">
            {items.filter(t => t.status === "pending").length} pending approval · {items.filter(t => t.status === "approved").length} approved
          </p>
        </div>
        <button onClick={() => setEditing({})}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <AnimatePresence>
        {editing !== null && <TestimonialForm item={editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
      </AnimatePresence>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search testimonials..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/50 transition-all" />
        </div>
        <div className="flex gap-1.5">
          {(["all", "approved", "pending", "rejected"] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border capitalize transition-all ${filter === s
                ? "bg-[#1A5F7A]/30 border-[#2a9d8f]/40 text-[#2a9d8f]"
                : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04 }}
              className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.12] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A5F7A]/30 to-[#2a9d8f]/20 border border-white/[0.07] flex-shrink-0 overflow-hidden">
                  {t.avatar ? <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-white/30 font-bold text-sm">{t.name[0]}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">· {t.role}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                  </div>
                  <p className="text-white/60 text-sm italic leading-relaxed">"{t.content}"</p>
                  <p className="text-white/25 text-xs mt-2">{t.date}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {t.status === "pending" && (
                    <>
                      <button onClick={() => approve(t.id)}
                        className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400/60 hover:text-emerald-400 transition-colors"
                        title="Approve">
                        <ThumbsUp size={14} />
                      </button>
                      <button onClick={() => reject(t.id)}
                        className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400/60 hover:text-rose-400 transition-colors"
                        title="Reject">
                        <ThumbsDown size={14} />
                      </button>
                    </>
                  )}
                  {t.status === "approved" && (
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Check size={14} />
                    </div>
                  )}
                  <button onClick={() => setEditing(t)}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-white/80 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => remove(t.id)}
                    className="w-8 h-8 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center justify-center text-rose-400/40 hover:text-rose-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/25">
            <Quote size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No testimonials found</p>
          </div>
        )}
      </div>
    </div>
  );
}
