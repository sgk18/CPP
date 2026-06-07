"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Pencil, Trash2, Save, Loader2, X, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Faculty = {
  id: string;
  name: string;
  role: string;
  department: string;
  campus: string;
  image: string;
  link: string;
};

function FacultyForm({ faculty, onSave, onCancel }: {
  faculty: Partial<Faculty>;
  onSave: (f: Partial<Faculty>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Faculty>>(faculty);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const f = (label: string, key: keyof Faculty, type = "text") => (
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
      <h3 className="text-white font-semibold text-sm mb-5">{faculty.id ? "Edit Faculty" : "Add Faculty"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {f("Full Name", "name")}
        {f("Role", "role")}
        {f("Department", "department")}
        {f("Campus", "campus")}
        {f("Image URL", "image")}
        {f("Profile Link", "link")}
      </div>
      <div className="flex items-center gap-3 mt-5 justify-end">
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all">
          <X size={14} /> Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save Faculty"}
        </button>
      </div>
    </motion.div>
  );
}

export default function FacultiesManagerPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Faculty> | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    setLoading(true);
    const { data } = await supabase.from("settings").select("value").eq("key", "faculties").single();
    if (data && data.value) {
      setFaculties(data.value as Faculty[]);
    }
    setLoading(false);
  };

  const handleSave = async (fac: Partial<Faculty>) => {
    let updated: Faculty[];
    if (fac.id) {
      updated = faculties.map(f => f.id === fac.id ? (fac as Faculty) : f);
    } else {
      updated = [...faculties, { ...fac, id: crypto.randomUUID() } as Faculty];
    }
    
    await supabase.from("settings").upsert({ key: "faculties", value: updated });
    setFaculties(updated);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this faculty member?")) return;
    setDeleting(id);
    const updated = faculties.filter(f => f.id !== id);
    await supabase.from("settings").upsert({ key: "faculties", value: updated });
    setFaculties(updated);
    setDeleting(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <GraduationCap size={18} className="text-[#2a9d8f]" /> Faculties Manager
          </h2>
          <p className="text-white/35 text-xs mt-0.5">{faculties.length} faculty members</p>
        </div>
        <button onClick={() => setEditing({})}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg">
          <Plus size={16} /> Add Faculty
        </button>
      </div>

      <AnimatePresence>
        {editing !== null && <FacultyForm faculty={editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence>
          {faculties.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04 }}
              className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-white/[0.12] transition-all">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                {f.image ? <img src={f.image} alt={f.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/30">{f.name[0]}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{f.name}</p>
                <p className="text-[#2a9d8f] text-xs mt-0.5">{f.role}</p>
                <p className="text-white/40 text-[11px] mt-1">{f.department} · {f.campus}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => setEditing(f)} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-white/80 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(f.id)} disabled={deleting === f.id}
                  className="w-8 h-8 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center justify-center text-rose-400/40 hover:text-rose-400 transition-colors disabled:opacity-50">
                  {deleting === f.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {faculties.length === 0 && !loading && (
          <div className="text-center py-16 text-white/25">
            <GraduationCap size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No faculties found</p>
          </div>
        )}
        
        {loading && (
          <div className="text-center py-16 text-white/25">
            <Loader2 size={32} className="mx-auto mb-3 opacity-30 animate-spin" />
            <p className="text-sm">Loading faculties...</p>
          </div>
        )}
      </div>
    </div>
  );
}
