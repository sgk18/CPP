"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Save, Check, Loader2 } from "lucide-react";

type SEOEntry = { page: string; title: string; description: string; keywords: string; ogImage: string };

const INITIAL_SEO: SEOEntry[] = [
  { page: "Home", title: "Centre for Peace Praxis | Hope, Healing & Resilience", description: "Building communities through peace literacy, intercultural dialogue, and collective well-being since 2023.", keywords: "peace, dialogue, resilience, Bengaluru, India", ogImage: "/assets/current_logo.png" },
  { page: "About", title: "About Us | Centre for Peace Praxis", description: "Learn about CPP's mission, vision, and core pillars for peacebuilding.", keywords: "about, mission, vision, peace praxis", ogImage: "/assets/current_logo.png" },
  { page: "Gallery", title: "Gallery | Centre for Peace Praxis", description: "Photos and moments from our events, workshops, and community programs.", keywords: "gallery, events, workshops, photos", ogImage: "/assets/current_logo.png" },
  { page: "Workshops", title: "Workshops | Centre for Peace Praxis", description: "Transformative workshops on peace, resilience, and intercultural dialogue.", keywords: "workshops, training, peace, resilience", ogImage: "/assets/current_logo.png" },
];

export default function SEOManagerPage() {
  const [seo, setSeo] = useState<SEOEntry[]>(INITIAL_SEO);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const update = (page: string, field: keyof SEOEntry, val: string) => {
    setSeo(prev => prev.map(s => s.page === page ? { ...s, [field]: val } : s));
  };

  const handleSave = async (page: string) => {
    setSaving(page);
    await new Promise(r => setTimeout(r, 700));
    setSaving(null);
    setSaved(page);
    setTimeout(() => setSaved(null), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <Search size={18} className="text-[#2a9d8f]" /> SEO Manager
        </h2>
        <p className="text-white/35 text-xs mt-0.5">Manage meta titles, descriptions, and Open Graph for each page</p>
      </div>

      {seo.map((entry, i) => (
        <motion.div key={entry.page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-sm">{entry.page} Page</h3>
              <p className="text-white/30 text-xs mt-0.5">/{entry.page.toLowerCase()}</p>
            </div>
            <button onClick={() => handleSave(entry.page)} disabled={saving === entry.page}
              className="flex items-center gap-2 text-xs font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-3 py-1.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-50">
              {saving === entry.page ? <Loader2 size={12} className="animate-spin" /> : saved === entry.page ? <Check size={12} /> : <Save size={12} />}
              {saving === entry.page ? "Saving..." : saved === entry.page ? "Saved!" : "Save"}
            </button>
          </div>

          {[
            { label: "Meta Title", field: "title" as const, hint: `${entry.title.length}/60 chars` },
            { label: "Meta Description", field: "description" as const, hint: `${entry.description.length}/160 chars`, multi: true },
            { label: "Keywords", field: "keywords" as const, hint: "Comma separated" },
            { label: "Open Graph Image URL", field: "ogImage" as const },
          ].map(({ label, field, hint, multi }) => (
            <div key={field}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-white/50 text-xs font-medium">{label}</label>
                {hint && <span className="text-white/20 text-[10px]">{hint}</span>}
              </div>
              {multi ? (
                <textarea rows={2} value={entry[field]}
                  onChange={e => update(entry.page, field, e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all resize-none" />
              ) : (
                <input type="text" value={entry[field]}
                  onChange={e => update(entry.page, field, e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all" />
              )}
            </div>
          ))}

          {/* Preview */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
            <p className="text-[10px] text-white/20 mb-2 uppercase tracking-widest">Google Preview</p>
            <p className="text-[#8ab4f8] text-sm font-medium truncate">{entry.title}</p>
            <p className="text-[#2a9d8f] text-xs">centreforpeacepraxis.in/{entry.page.toLowerCase()}</p>
            <p className="text-white/40 text-xs mt-1 line-clamp-2">{entry.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
