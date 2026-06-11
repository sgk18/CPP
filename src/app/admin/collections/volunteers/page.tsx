"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Pencil, Trash2, Search, Filter,
  ChevronDown, Loader2, X, Save, Mail, Phone
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Volunteer = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  image_url: string;
  joined_date: string;
};

const STATUS_COLORS = {
  active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  inactive: "text-white/30 bg-white/5 border-white/10",
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

function VolunteerForm({ volunteer, onSave, onCancel }: {
  volunteer: Partial<Volunteer>;
  onSave: (v: Partial<Volunteer>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Volunteer>>({ status: "active", ...volunteer });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const f = (label: string, key: keyof Volunteer, type = "text") => (
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
      <h3 className="text-white font-semibold text-sm mb-5">{volunteer.id ? "Edit Volunteer" : "Add Volunteer"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {f("Full Name", "name")}
        {f("Role / Title", "role")}
        {f("Department", "department")}
        {f("Email", "email", "email")}
        {f("Phone", "phone", "tel")}
        {f("Photo URL / Path", "image_url")}
        {f("Join Date", "joined_date", "date")}
        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Status</label>
          <select value={form.status}
            onChange={e => setForm(p => ({ ...p, status: e.target.value as Volunteer["status"] }))}
            className="w-full bg-[#060e14] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all">
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-5 justify-end">
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all">
          <X size={14} /> Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save Volunteer"}
        </button>
      </div>
    </motion.div>
  );
}

export default function VolunteersManagerPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Volunteer["status"]>("all");
  const [editing, setEditing] = useState<Partial<Volunteer> | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    const { data } = await supabase.from("volunteers").select("*").order("created_at", { ascending: false });
    if (data) setVolunteers(data as Volunteer[]);
    setLoading(false);
  };

  const filtered = volunteers.filter(v =>
    (filterStatus === "all" || v.status === filterStatus) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || (v.role || "").toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = async (vol: Partial<Volunteer>) => {
    if (vol.id) {
      // Update
      const { data, error } = await supabase.from("volunteers").update(vol).eq("id", vol.id).select().single();
      if (!error && data) {
        setVolunteers(prev => prev.map(v => v.id === data.id ? data as Volunteer : v));
      }
    } else {
      // Insert
      const { data, error } = await supabase.from("volunteers").insert(vol).select().single();
      if (!error && data) {
        setVolunteers(prev => [data as Volunteer, ...prev]);
      }
    }
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this volunteer?")) return;
    setDeleting(id);
    const { error } = await supabase.from("volunteers").delete().eq("id", id);
    if (!error) {
      setVolunteers(prev => prev.filter(v => v.id !== id));
    }
    setDeleting(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Users size={18} className="text-[#2a9d8f]" /> Volunteer Manager
          </h2>
          <p className="text-white/35 text-xs mt-0.5">{volunteers.filter(v => v.status === "active").length} active · {volunteers.length} total</p>
        </div>
        <button onClick={() => setEditing({})}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg">
          <Plus size={16} /> Add Volunteer
        </button>
      </div>

      <AnimatePresence>
        {editing !== null && <VolunteerForm volunteer={editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
      </AnimatePresence>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search volunteers..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/50 transition-all" />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
            className="bg-[#060e14] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2.5 text-white/60 text-sm outline-none appearance-none">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04 }}
              className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-white/[0.12] transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A5F7A]/30 to-[#2a9d8f]/20 border border-white/[0.07] flex-shrink-0 overflow-hidden">
                {v.image_url ? <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-white/30 font-bold text-lg">{v.name[0]}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-semibold text-sm">{v.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[v.status]}`}>{v.status}</span>
                </div>
                <p className="text-[#2a9d8f] text-xs mt-0.5">{v.role} {v.department && `· ${v.department}`}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {v.email && <p className="text-white/40 text-[11px] flex items-center gap-1.5"><Mail size={10} /> {v.email}</p>}
                  {v.phone && <p className="text-white/40 text-[11px] flex items-center gap-1.5"><Phone size={10} /> {v.phone}</p>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
                <p className="text-white/30 text-[10px]">Joined {v.joined_date}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <button onClick={() => setEditing(v)} className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-white/80 transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => handleDelete(v.id)} disabled={deleting === v.id}
                    className="w-7 h-7 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center justify-center text-rose-400/40 hover:text-rose-400 transition-colors disabled:opacity-50">
                    {deleting === v.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 text-white/25">
            <Users size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No volunteers found</p>
          </div>
        )}
        {loading && (
          <div className="text-center py-16 text-white/25">
            <Loader2 size={32} className="mx-auto mb-3 opacity-30 animate-spin" />
            <p className="text-sm">Loading volunteers...</p>
          </div>
        )}
      </div>
    </div>
  );
}
