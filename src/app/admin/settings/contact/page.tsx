"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe, Save, Check, Loader2, Plus, Trash2 } from "lucide-react";

type ContactData = {
  address: string; email: string; phone: string; altPhone: string; mapLink: string;
  socialLinks: { platform: string; url: string }[];
};

const INITIAL: ContactData = {
  address: "Centre for Peace Praxis, Christ (Deemed to be University), Hosur Road, Bengaluru – 560029, India",
  email: "peacepraxis@christuniversity.in",
  phone: "+91 80 4012 9100",
  altPhone: "",
  mapLink: "https://maps.google.com/?q=Christ+University+Bengaluru",
  socialLinks: [
    { platform: "Instagram", url: "https://instagram.com/centreforpeacepraxis" },
    { platform: "Facebook", url: "" },
    { platform: "LinkedIn", url: "" },
  ],
};

export default function ContactManagerPage() {
  const [data, setData] = useState<ContactData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateSocial = (i: number, field: "platform" | "url", val: string) => {
    setData(prev => {
      const links = [...prev.socialLinks];
      links[i] = { ...links[i], [field]: val };
      return { ...prev, socialLinks: links };
    });
  };

  const addSocial = () => setData(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { platform: "", url: "" }] }));
  const removeSocial = (i: number) => setData(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, idx) => idx !== i) }));

  const field = (label: string, key: keyof ContactData, icon: React.ReactNode, type = "text") => (
    <div>
      <label className="block text-white/50 text-xs font-medium mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25">{icon}</div>
        <input type={type} value={(data[key] as string) ?? ""}
          onChange={e => setData(prev => ({ ...prev, [key]: e.target.value }))}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all" />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Mail size={18} className="text-[#2a9d8f]" /> Contact Manager
          </h2>
          <p className="text-white/35 text-xs mt-0.5">Update address, phone, email, and social media links</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-5 space-y-4">
        <h3 className="text-white font-semibold text-sm">Contact Details</h3>
        <div>
          <label className="block text-white/50 text-xs font-medium mb-1.5">Address</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-3 text-white/25" />
            <textarea rows={3} value={data.address}
              onChange={e => setData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all resize-none" />
          </div>
        </div>
        {field("Email Address", "email", <Mail size={14} />, "email")}
        {field("Primary Phone", "phone", <Phone size={14} />, "tel")}
        {field("Alternative Phone", "altPhone", <Phone size={14} />, "tel")}
        {field("Google Maps Link", "mapLink", <Globe size={14} />, "url")}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">Social Media Links</h3>
          <button onClick={addSocial}
            className="flex items-center gap-1.5 text-xs text-[#2a9d8f] hover:text-white transition-colors">
            <Plus size={14} /> Add Link
          </button>
        </div>
        {data.socialLinks.map((link, i) => (
          <div key={i} className="flex items-center gap-3">
            <input value={link.platform} onChange={e => updateSocial(i, "platform", e.target.value)}
              placeholder="Platform" className="w-32 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all flex-shrink-0" />
            <input value={link.url} onChange={e => updateSocial(i, "url", e.target.value)}
              placeholder="https://..." className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-[#2a9d8f]/60 transition-all" />
            <button onClick={() => removeSocial(i)}
              className="w-8 h-8 rounded-lg border border-rose-500/10 bg-rose-500/5 flex items-center justify-center text-rose-400/40 hover:text-rose-400 transition-colors flex-shrink-0">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
