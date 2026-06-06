"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Search, Filter, Calendar,
  ExternalLink, ChevronDown, Loader2, X, Save, ImageIcon
} from "lucide-react";

type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  registrationLink: string;
  status: "upcoming" | "past" | "ongoing";
};

const INITIAL_EVENTS: Event[] = [
  { id: "1", title: "Inter-Religious Visit", date: "2026-02-20", description: "A one-day visit to multiple religious institutions including Gurudwara, Mahabodhi, and Dharmaram.", image: "/assets/peaceaxis_image11.jpg", registrationLink: "", status: "past" },
  { id: "2", title: "Film Festival & Panel Discussion", date: "2026-02-24", description: "A one-day film screening followed by a panel discussion.", image: "/assets/peaceaxis_image9.jpg", registrationLink: "", status: "past" },
  { id: "3", title: "Psychosocial Well-being Workshop", date: "2026-02-19", description: "A 3-hour workshop on \"Resilience and Recovery\" with e-certificates.", image: "/assets/peaceaxis_image12.jpg", registrationLink: "", status: "past" },
  { id: "4", title: "SDG Week – NGO Stalls", date: "2026-02-12", description: "NGO stalls to promote sustainable development goals during SDG Week.", image: "/assets/peaceaxis_image6.jpg", registrationLink: "", status: "past" },
  { id: "5", title: "Volunteer in Philippines", date: "2026-05-12", description: "International volunteering at Mindanao Peacebuilding Institute, May 12-31, 2026.", image: "/assets/volunteer_philippines.jpg", registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLScmjweCQfwquN_aHSy9Tz_DkvodQwyqULN-3AQ19-SfWxP2Lw/viewform", status: "upcoming" },
];

const STATUS_COLORS = {
  upcoming: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  ongoing: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  past: "text-white/30 bg-white/5 border-white/10",
};

function EventForm({ event, onSave, onCancel }: {
  event: Partial<Event>;
  onSave: (e: Event) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Event>>({ status: "upcoming", ...event });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title || !form.date) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    onSave({ id: form.id || Date.now().toString(), title: form.title!, date: form.date!, description: form.description || "", image: form.image || "", registrationLink: form.registrationLink || "", status: form.status || "upcoming" });
    setSaving(false);
  };

  const field = (label: string, key: keyof Event, type = "text") => (
    <div>
      <label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
      <input
        type={type}
        value={(form[key] as string) ?? ""}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-[#0d1f2d]/80 backdrop-blur border border-[#2a9d8f]/30 rounded-2xl p-6 mb-4"
    >
      <h3 className="text-white font-semibold text-sm mb-5">{event.id ? "Edit Event" : "New Event"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Event Title", "title")}
        {field("Date", "date", "date")}
        <div className="sm:col-span-2">
          <label className="block text-white/50 text-xs font-medium mb-1.5">Description</label>
          <textarea
            rows={3}
            value={form.description ?? ""}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all resize-none"
          />
        </div>
        {field("Image Path / URL", "image")}
        {field("Registration Link", "registrationLink")}
        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={e => setForm(p => ({ ...p, status: e.target.value as Event["status"] }))}
            className="w-full bg-[#060e14] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-5 justify-end">
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] transition-all">
          <X size={14} /> Cancel
        </button>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save Event"}
        </button>
      </div>
    </motion.div>
  );
}

export default function EventsManagerPage() {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Event["status"]>("all");
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSave = (event: Event) => {
    setEvents(prev => {
      const idx = prev.findIndex(e => e.id === event.id);
      if (idx >= 0) { const arr = [...prev]; arr[idx] = event; return arr; }
      return [event, ...prev];
    });
    setEditingEvent(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    setDeleting(id);
    await new Promise(r => setTimeout(r, 500));
    setEvents(prev => prev.filter(e => e.id !== id));
    setDeleting(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Calendar size={18} className="text-[#2a9d8f]" /> Events Manager
          </h2>
          <p className="text-white/35 text-xs mt-0.5">{events.length} events total</p>
        </div>
        <button
          onClick={() => setEditingEvent({})}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg"
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      {/* New / Edit form */}
      <AnimatePresence>
        {editingEvent !== null && (
          <EventForm event={editingEvent} onSave={handleSave} onCancel={() => setEditingEvent(null)} />
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/50 transition-all"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
            className="bg-[#060e14] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2.5 text-white/60 text-sm outline-none focus:border-[#2a9d8f]/50 transition-all appearance-none"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="past">Past</option>
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      {/* Events list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.04 }}
              className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-white/[0.12] transition-all"
            >
              {/* Image thumb */}
              <div className="w-16 h-16 rounded-xl bg-white/[0.04] border border-white/[0.07] flex-shrink-0 overflow-hidden">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-white/20" /></div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-semibold text-sm">{event.title}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[event.status]}`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-[#2a9d8f] text-xs mt-0.5 flex items-center gap-1">
                  <Calendar size={10} /> {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p className="text-white/40 text-xs mt-1 truncate">{event.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {event.registrationLink && (
                  <a href={event.registrationLink} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-[#2a9d8f] transition-colors">
                    <ExternalLink size={14} />
                  </a>
                )}
                <button onClick={() => setEditingEvent(event)}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-white/80 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(event.id)}
                  disabled={deleting === event.id}
                  className="w-8 h-8 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center justify-center text-rose-400/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                  {deleting === event.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/25">
            <Calendar size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No events found</p>
          </div>
        )}
      </div>
    </div>
  );
}
