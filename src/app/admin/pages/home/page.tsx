"use client";
export const dynamic = "force-dynamic";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Eye, EyeOff, Monitor, Smartphone, RotateCcw,
  ChevronDown, ChevronUp, Check, Loader2, Sparkles
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── Default content seeded from static page ───────────────────
const DEFAULT = {
  heroTitle: "Hope, Healing & Resilience",
  heroDesc: "Building communities through peace literacy, intercultural dialogue, and collective well-being since 2023.",
  whyTitle: "Why Centre for Peace Praxis?",
  whyDesc: "Empowering individuals to become agents of positive change.",
  feature1Title: "Make a Real Difference!",
  feature1Desc: "Contribute to meaningful peacebuilding initiatives that create lasting impact locally and globally.",
  feature2Title: "Build Capacity!",
  feature2Desc: "Develop essential skills in communication, teamwork, creativity, and conflict resolution.",
  feature3Title: "Have Fun!",
  feature3Desc: "Connect with like-minded people, work on creative projects, and be part of a vibrant community.",
  stat1Value: "20+", stat1Label: "Activities Conducted",
  stat2Value: "1000+", stat2Label: "Participants",
  stat3Value: "15+", stat3Label: "Partner Organizations",
  stat4Value: "4", stat4Label: "Core Pillars",
  aboutBadge: "About Us",
  aboutTitle: "Our Journey Towards A More Peaceful World",
  aboutContent1: "Established in 2023, the Centre for Peace Praxis aims at building communities of hope, healing, and resilience.",
  aboutContent2: "We believe that peace is not just the absence of conflict, but the presence of justice, understanding, and active cooperation.",
  aboutContent3: "Aligned with our pillars—Media Literacy, Psychosocial Support, Intercultural Dialogue, and Ecological Wellbeing—we create environments where diversity is embraced as a strength.",
  volunteerTitle: "Volunteer With Us",
  volunteerDesc: "Volunteering at the Centre for Peace Praxis is your chance to make a real difference.",
  volunteerQuote: "\u201cPeace is hard-earned, intentional, and sustained through listening, inclusion, and hope.\u201d",
};

type ContentKey = keyof typeof DEFAULT;

// ── Reusable field components ─────────────────────────────────
function Field({
  label,
  field,
  value,
  onChange,
  multiline = false,
  hint,
}: {
  label: string;
  field: ContentKey;
  value: string;
  onChange: (k: ContentKey, v: string) => void;
  multiline?: boolean;
  hint?: string;
}) {
  const cls =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/25 outline-none focus:border-[#2a9d8f]/60 focus:bg-white/[0.06] transition-all resize-none";
  return (
    <div>
      <label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
      {multiline ? (
        <textarea rows={3} className={cls} value={value} onChange={(e) => onChange(field, e.target.value)} />
      ) : (
        <input type="text" className={cls} value={value} onChange={(e) => onChange(field, e.target.value)} />
      )}
      {hint && <p className="text-white/20 text-[10px] mt-1">{hint}</p>}
    </div>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white font-semibold text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-white/[0.05]">
              <div className="pt-4 space-y-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Live Preview iframe ───────────────────────────────────────
function LivePreview({ content, device }: { content: typeof DEFAULT; device: "desktop" | "mobile" }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendContent = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: "CPP_PREVIEW_UPDATE", content }, "*");
  }, [content]);

  return (
    <div className={`relative mx-auto transition-all duration-500 ${device === "mobile" ? "max-w-[390px]" : "w-full"}`}>
      <div className="bg-[#0a1a25] rounded-2xl border border-white/[0.07] overflow-hidden shadow-2xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#060e14]/80 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-3 bg-white/[0.04] border border-white/[0.06] rounded-md px-3 py-1 text-white/25 text-xs text-center">
            centreforpeacepraxis.in · Live Preview
          </div>
        </div>

        {/* iframe */}
        <iframe
          ref={iframeRef}
          src="/?preview=1"
          onLoad={sendContent}
          title="Live Homepage Preview"
          className="w-full border-0"
          style={{ height: device === "mobile" ? "600px" : "520px" }}
        />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function HomepageManagerPage() {
  const [content, setContent] = useState<typeof DEFAULT>({ ...DEFAULT });
  const [showPreview, setShowPreview] = useState(true);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data } = await supabase.from("pages").select("content").eq("slug", "home").single();
    if (data && data.content) {
      setContent(data.content as typeof DEFAULT);
    }
    setLoading(false);
  };

  const handleChange = useCallback((key: ContentKey, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("pages").update({ content }).eq("slug", "home");
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert("Error saving: " + error.message);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all changes to default content?")) setContent({ ...DEFAULT });
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Sparkles size={18} className="text-[#2a9d8f]" />
            Visual Page Editor
          </h2>
          <p className="text-white/35 text-xs mt-0.5">Edit content on the left · See live changes on the right</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Device toggle */}
          <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 gap-1">
            <button
              onClick={() => setDevice("desktop")}
              className={`p-2 rounded-lg transition-all ${device === "desktop" ? "bg-[#1A5F7A]/40 text-[#2a9d8f]" : "text-white/30 hover:text-white/60"}`}
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`p-2 rounded-lg transition-all ${device === "mobile" ? "bg-[#1A5F7A]/40 text-[#2a9d8f]" : "text-white/30 hover:text-white/60"}`}
            >
              <Smartphone size={14} />
            </button>
          </div>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 text-xs font-medium text-white/40 hover:text-white/80 border border-white/[0.08] bg-white/[0.04] px-3 py-2 rounded-xl transition-all"
          >
            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            {showPreview ? "Hide" : "Show"} Preview
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-xs font-medium text-white/40 hover:text-white/80 border border-white/[0.08] bg-white/[0.04] px-3 py-2 rounded-xl transition-all"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 text-xs font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] hover:opacity-90 disabled:opacity-50 text-white px-4 py-2 rounded-xl transition-all shadow-lg"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div className={`grid gap-6 ${showPreview ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1 max-w-3xl"}`}>
        {/* Editor panel */}
        <div className="space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
          <Section title="🦸 Hero Section">
            <Field label="Hero Title" field="heroTitle" value={content.heroTitle} onChange={handleChange} hint="Main headline visible above the fold" />
            <Field label="Hero Description" field="heroDesc" value={content.heroDesc} onChange={handleChange} multiline />
          </Section>

          <Section title="✨ Why Us Section">
            <Field label="Section Title" field="whyTitle" value={content.whyTitle} onChange={handleChange} />
            <Field label="Section Description" field="whyDesc" value={content.whyDesc} onChange={handleChange} multiline />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Field label="Feature 1 Title" field="feature1Title" value={content.feature1Title} onChange={handleChange} />
                <Field label="Feature 1 Description" field="feature1Desc" value={content.feature1Desc} onChange={handleChange} multiline />
              </div>
              <div className="space-y-2">
                <Field label="Feature 2 Title" field="feature2Title" value={content.feature2Title} onChange={handleChange} />
                <Field label="Feature 2 Description" field="feature2Desc" value={content.feature2Desc} onChange={handleChange} multiline />
              </div>
              <div className="space-y-2">
                <Field label="Feature 3 Title" field="feature3Title" value={content.feature3Title} onChange={handleChange} />
                <Field label="Feature 3 Description" field="feature3Desc" value={content.feature3Desc} onChange={handleChange} multiline />
              </div>
            </div>
          </Section>

          <Section title="📊 Statistics" defaultOpen={false}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Stat 1 Value" field="stat1Value" value={content.stat1Value} onChange={handleChange} />
              <Field label="Stat 1 Label" field="stat1Label" value={content.stat1Label} onChange={handleChange} />
              <Field label="Stat 2 Value" field="stat2Value" value={content.stat2Value} onChange={handleChange} />
              <Field label="Stat 2 Label" field="stat2Label" value={content.stat2Label} onChange={handleChange} />
              <Field label="Stat 3 Value" field="stat3Value" value={content.stat3Value} onChange={handleChange} />
              <Field label="Stat 3 Label" field="stat3Label" value={content.stat3Label} onChange={handleChange} />
              <Field label="Stat 4 Value" field="stat4Value" value={content.stat4Value} onChange={handleChange} />
              <Field label="Stat 4 Label" field="stat4Label" value={content.stat4Label} onChange={handleChange} />
            </div>
          </Section>

          <Section title="🏛️ About Section" defaultOpen={false}>
            <Field label="Badge Text" field="aboutBadge" value={content.aboutBadge} onChange={handleChange} />
            <Field label="Section Title" field="aboutTitle" value={content.aboutTitle} onChange={handleChange} />
            <Field label="Paragraph 1" field="aboutContent1" value={content.aboutContent1} onChange={handleChange} multiline />
            <Field label="Paragraph 2" field="aboutContent2" value={content.aboutContent2} onChange={handleChange} multiline />
            <Field label="Paragraph 3" field="aboutContent3" value={content.aboutContent3} onChange={handleChange} multiline />
          </Section>

          <Section title="🤝 Volunteer Section" defaultOpen={false}>
            <Field label="Section Title" field="volunteerTitle" value={content.volunteerTitle} onChange={handleChange} />
            <Field label="Description" field="volunteerDesc" value={content.volunteerDesc} onChange={handleChange} multiline />
            <Field label="Pull Quote" field="volunteerQuote" value={content.volunteerQuote} onChange={handleChange} multiline />
          </Section>
        </div>

        {/* Preview panel */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-0"
            style={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}
          >
            <LivePreview content={content} device={device} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
