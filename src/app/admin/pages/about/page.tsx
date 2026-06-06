"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Save, Check, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const DEFAULT = {
  missionTitle: "Our Mission",
  mission: "To build communities of hope, healing, and resilience through peace literacy, intercultural dialogue, and collective well-being.",
  visionTitle: "Our Vision",
  vision: "A world where every individual is an active agent of peace — rooted in justice, empathy, and ecological consciousness.",
  storyTitle: "Our Story",
  story: "Established in 2023 at Christ (Deemed to be University), Bengaluru, the Centre for Peace Praxis emerged from the belief that peace education is not a luxury, but a necessity.",
  pillar1Title: "Intercultural Dialogue",
  pillar1Desc: "Fostering understanding and respect across diverse cultures, beliefs, and backgrounds through open conversations.",
  pillar2Title: "Psycho-social Well-being",
  pillar2Desc: "Supporting mental and emotional health through community-based approaches to healing and resilience.",
  pillar3Title: "Media Literacy",
  pillar3Desc: "Developing critical thinking skills to navigate today's complex media landscape and counter misinformation.",
  pillar4Title: "Eco-consciousness",
  pillar4Desc: "Promoting environmental awareness and sustainable practices as integral components of peace.",
  directorName: "Dr. Padmakumar MM",
  directorTitle: "Director, Centre for Peace Praxis",
  directorMessage: "At the Centre for Peace Praxis, we believe that peace begins within — in how we relate to ourselves, to each other, and to the world around us. Our work is grounded in the conviction that peace is not passive, but an active practice of compassion, justice, and hope.",
  directorImage: "/assets/peaceaxis_image5.jpg",
  teamTitle: "Our Team",
  teamDesc: "A dedicated team of educators, students, and community partners committed to peacebuilding.",
};

type Key = keyof typeof DEFAULT;

function Section({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
        <span className="text-white font-semibold text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-5 pb-5 pt-4 border-t border-white/[0.05] space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AboutManagerPage() {
  const [content, setContent] = useState(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: Key, val: string) => { setContent(prev => ({ ...prev, [key]: val })); setSaved(false); };

  const tf = (label: string, key: Key, rows = 1) => (
    <div>
      <label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
      {rows > 1 ? (
        <textarea rows={rows} value={content[key]} onChange={e => set(key, e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all resize-none" />
      ) : (
        <input value={content[key]} onChange={e => set(key, e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all" />
      )}
    </div>
  );

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <FileText size={18} className="text-[#2a9d8f]" /> About Page Manager
          </h2>
          <p className="text-white/35 text-xs mt-0.5">Mission, Vision, Director's note, Pillars & Team</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <Section title="🎯 Mission & Vision">
        {tf("Mission Title", "missionTitle")}
        {tf("Mission Statement", "mission", 3)}
        {tf("Vision Title", "visionTitle")}
        {tf("Vision Statement", "vision", 3)}
      </Section>

      <Section title="📖 Our Story">
        {tf("Story Section Title", "storyTitle")}
        {tf("Story Content", "story", 5)}
      </Section>

      <Section title="🏛️ Core Pillars" defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="space-y-2 bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
              <p className="text-[#2a9d8f] text-xs font-semibold">Pillar {n}</p>
              {tf(`Title`, `pillar${n}Title` as Key)}
              {tf(`Description`, `pillar${n}Desc` as Key, 2)}
            </div>
          ))}
        </div>
      </Section>

      <Section title="👤 Director's Note" defaultOpen={false}>
        {tf("Director's Name", "directorName")}
        {tf("Director's Title / Role", "directorTitle")}
        {tf("Photo URL / Path", "directorImage")}
        {tf("Director's Message", "directorMessage", 6)}
      </Section>

      <Section title="👥 Team Section" defaultOpen={false}>
        {tf("Section Title", "teamTitle")}
        {tf("Section Description", "teamDesc", 2)}
        <p className="text-white/25 text-xs">Individual team members are managed in the <a href="/admin/collections/volunteers" className="text-[#2a9d8f] underline">Volunteer Manager</a>.</p>
      </Section>
    </div>
  );
}
