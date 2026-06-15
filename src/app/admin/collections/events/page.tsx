"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Search, Filter, Calendar,
  ExternalLink, ChevronDown, Loader2, X, Save, ImageIcon, Upload
} from "lucide-react";
import { createEventAction, updateEventAction, deleteEventAction, getEventsAction } from "@/lib/actions/events";

type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  image_url: string;
  image_path?: string;
  registration_link: string;
  venue?: string;
  status: "upcoming" | "past" | "ongoing";
};

const STATUS_COLORS = {
  upcoming: "text-emerald-700 bg-emerald-50 border-emerald-200",
  ongoing: "text-amber-700 bg-amber-50 border-amber-200",
  past: "text-gray-400 bg-gray-100 border-gray-200",
};

function EventForm({ event, onSave, onCancel }: {
  event: Partial<Event>;
  onSave: (e: Partial<Event>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Event>>({ status: "upcoming", ...event });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    if (!form.title || !form.date) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const resData = await res.json();
      if (resData.success && resData.metadata) {
        setForm(p => ({
          ...p,
          image_path: resData.metadata.url,
          image_url: resData.metadata.url
        }));
      } else {
        alert("Upload failed: " + (resData.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const field = (label: string, key: keyof Event, type = "text") => (
    <div>
      <label className="block text-gray-700 text-xs font-medium mb-1.5">{label}</label>
      <input
        type={type}
        value={(form[key] as string) ?? ""}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none focus:border-[#2a9d8f]/60 transition-all"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-gray-50/90 backdrop-blur border border-gray-200 rounded-2xl p-6 mb-4"
    >
      <h3 className="text-gray-900 font-semibold text-sm mb-5">{event.id ? "Edit Event" : "New Event"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Event Title", "title")}
        {field("Date", "date", "date")}
        {field("Venue", "venue")}
        {field("Registration Link", "registration_link")}
        
        <div className="sm:col-span-2">
          <label className="block text-gray-700 text-xs font-medium mb-1.5">Description</label>
          <textarea
            rows={3}
            value={form.description ?? ""}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none focus:border-[#2a9d8f]/60 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-medium mb-1.5">Upload Event Image</label>
          <div className="flex items-center gap-3">
            {form.image_path && (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                <img src={form.image_path} alt="Thumbnail preview" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-gray-200 hover:border-gray-300 rounded-xl p-3 cursor-pointer hover:bg-gray-50/30 transition-colors">
              {uploading ? (
                <Loader2 size={14} className="animate-spin text-gray-500" />
              ) : (
                <Upload size={14} className="text-gray-500" />
              )}
              <span className="text-gray-500 text-xs">{uploading ? "Uploading..." : "Choose Image"}</span>
              <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        {field("Or Enter Image URL Path", "image_path")}

        <div>
          <label className="block text-gray-700 text-xs font-medium mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={e => setForm(p => ({ ...p, status: e.target.value as Event["status"] }))}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 text-sm outline-none focus:border-[#2a9d8f]/60 transition-all"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5 justify-end">
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50/30 transition-all">
          <X size={14} /> Cancel
        </button>
        <button onClick={handleSave} disabled={saving || uploading} className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save Event"}
        </button>
      </div>
    </motion.div>
  );
}

export default function EventsManagerPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Event["status"]>("all");
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  async function fetchEvents() {
    setLoading(true);
    const res = await getEventsAction();
    if (res.success && res.records) {
      setEvents(res.records as Event[]);
    } else if (res.error) {
      alert("Error loading events: " + res.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchEvents();
    });
  }, []);

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || (e.description || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSave = async (formEvent: Partial<Event>) => {
    // Standardize variables for insert/update payload
    const payload = {
      title: formEvent.title || "",
      date: formEvent.date || "",
      description: formEvent.description || "",
      venue: formEvent.venue || "",
      registration_link: formEvent.registration_link || "",
      image_path: formEvent.image_path || formEvent.image_url || "",
      status: formEvent.status || "upcoming",
    };

    if (formEvent.id) {
      // Update
      const res = await updateEventAction(formEvent.id, payload);
      if (res.success && res.record) {
        setEvents(prev => prev.map(e => e.id === formEvent.id ? res.record as Event : e));
      } else {
        alert("Error saving: " + res.error);
      }
    } else {
      // Insert
      const res = await createEventAction(payload);
      if (res.success && res.record) {
        setEvents(prev => [res.record as Event, ...prev]);
      } else {
        alert("Error saving: " + res.error);
      }
    }
    setEditingEvent(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    setDeleting(id);
    const res = await deleteEventAction(id);
    if (res.success) {
      setEvents(prev => prev.filter(e => e.id !== id));
    } else {
      alert("Error deleting: " + res.error);
    }
    setDeleting(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2">
            <Calendar size={18} className="text-[#2a9d8f]" /> Events Manager
          </h2>
          <p className="text-gray-500 text-xs mt-0.5">{events.length} events total</p>
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
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-gray-900 text-sm outline-none focus:border-[#2a9d8f]/50 transition-all"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
            className="bg-white border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-gray-600 text-sm outline-none focus:border-[#2a9d8f]/50 transition-all appearance-none"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="past">Past</option>
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
              className="bg-white backdrop-blur border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-gray-300 transition-all"
            >
              {/* Image thumb */}
              <div className="w-16 h-16 rounded-xl bg-gray-50/50 border border-gray-200 flex-shrink-0 overflow-hidden">
                {event.image_path || event.image_url ? (
                  <img src={event.image_path || event.image_url} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-gray-400" /></div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-gray-900 font-semibold text-sm">{event.title}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[event.status]}`}>
                    {event.status}
                  </span>
                </div>
                <div className="flex gap-4 mt-0.5">
                  <p className="text-[#2a9d8f] text-xs flex items-center gap-1">
                    <Calendar size={10} /> {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  {event.venue && (
                    <p className="text-gray-500 text-xs">
                      Venue: {event.venue}
                    </p>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-1 truncate">{event.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {event.registration_link && (
                  <a href={event.registration_link} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-gray-50/50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#2a9d8f] transition-colors">
                    <ExternalLink size={14} />
                  </a>
                )}
                <button onClick={() => setEditingEvent(event)}
                  className="w-8 h-8 rounded-lg bg-gray-50/50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(event.id)}
                  disabled={deleting === event.id}
                  className="w-8 h-8 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all">
                  {deleting === event.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <Calendar size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No events found</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-16 text-gray-400">
            <Loader2 size={32} className="mx-auto mb-3 opacity-30 animate-spin" />
            <p className="text-sm">Loading events...</p>
          </div>
        )}
      </div>
    </div>
  );
}
