"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Pencil, Trash2, Save, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Alumni = {
  id: string;
  name: string;
  image: string;
};

function AlumniForm({ alumni, onSave, onCancel }: {
  alumni: Partial<Alumni>;
  onSave: (a: Partial<Alumni>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Alumni>>(alumni);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const f = (label: string, key: keyof Alumni, type = "text") => (
    <div>
      <label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
      <input type={type} value={(form[key] as string) ?? ""}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="bg-[#0d1f2d]/80 backdrop-blur border border-[#2a9d8f]/30 rounded-2xl p-6 mb-4">
      <h3 className="text-white font-semibold text-sm mb-5">{alumni.id ? "Edit Alumni" : "Add Alumni"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {f("Full Name", "name")}
        {f("Image URL", "image")}
      </div>
      <div className="flex items-center gap-3 mt-5 justify-end">
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all">
          <X size={14} /> Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save Alumni"}
        </button>
      </div>
    </motion.div>
  );
}

export default function AlumniManagerPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Alumni> | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    const { data } = await supabase.from("settings").select("value").eq("key", "alumni").single();
    if (data && data.value) {
      setAlumni(data.value as Alumni[]);
    }
    setLoading(false);
  };

  const handleSave = async (al: Partial<Alumni>) => {
    let updated: Alumni[];
    if (al.id) {
      updated = alumni.map(a => a.id === al.id ? (al as Alumni) : a);
    } else {
      updated = [...alumni, { ...al, id: crypto.randomUUID() } as Alumni];
    }
    
    await supabase.from("settings").upsert({ key: "alumni", value: updated });
    setAlumni(updated);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this alumni?")) return;
    setDeleting(id);
    const updated = alumni.filter(a => a.id !== id);
    await supabase.from("settings").upsert({ key: "alumni", value: updated });
    setAlumni(updated);
    setDeleting(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Users size={18} className="text-[#2a9d8f]" /> Alumni Manager
          </h2>
          <p className="text-white/35 text-xs mt-0.5">{alumni.length} alumni</p>
        </div>
        <button onClick={() => setEditing({})}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg">
          <Plus size={16} /> Add Alumni
        </button>
      </div>

      <AnimatePresence>
        {editing !== null && <AlumniForm alumni={editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {alumni.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03 }}
              className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-4 flex flex-col items-center text-center gap-3 hover:border-white/[0.12] transition-all relative group">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                {a.image ? <img src={a.image} alt={a.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/30">{a.name[0]}</div>}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{a.name}</p>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(a)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                  <Pencil size={12} />
                </button>
                <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id}
                  className="w-7 h-7 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 flex items-center justify-center text-rose-400 transition-colors disabled:opacity-50">
                  {deleting === a.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {alumni.length === 0 && !loading && (
        <div className="text-center py-16 text-white/25">
          <Users size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No alumni found</p>
        </div>
      )}
      
      {loading && (
        <div className="text-center py-16 text-white/25">
          <Loader2 size={32} className="mx-auto mb-3 opacity-30 animate-spin" />
          <p className="text-sm">Loading alumni...</p>
        </div>
      )}
    </div>
  );
}
