"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Save, ShieldAlert, ArrowLeft, Laptop, Smartphone, Eye } from "lucide-react";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

const DEFAULT_CONTENT = {
  heroTitle: "Hope, Healing & Resilience",
  heroDesc: "Building communities through peace literacy, intercultural dialogue, and collective well-being since 2023.",
  aboutContent1: "Established in 2023, the Centre for Peace Praxis aims at building communities of hope, healing, and resilience.",
  aboutContent2: "We believe that peace is not just the absence of conflict, but the presence of justice, understanding, and active cooperation. To achieve this, we organize regular workshops, dialogues, and events that spread peace literacy.",
  aboutContent3: "Aligned with our pillars—Media Literacy, Psychosocial Support, Intercultural Dialogue, and Ecological Wellbeing—we create environments where diversity is embraced as a strength.",
  stat1: "20+",
  stat2: "1000+",
  stat3: "15+",
  stat4: "4",
  volunteerQuote: "“Peace is hard-earned, intentional, and sustained through listening, inclusion, and hope.”"
};

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "stats" | "volunteer">("hero");
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const router = useRouter();

  useEffect(() => {
    // Route guard
    const auth = localStorage.getItem("cpp_is_authenticated");
    if (auth !== "true") {
      setTimeout(() => {
        setIsAuthenticated(false);
      }, 0);
      router.push("/login");
    } else {
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 0);
    }

    // Load content
    const saved = localStorage.getItem("cpp_builder_content");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setContent((prev) => ({ ...prev, ...parsed }));
        }, 0);
      } catch (e) {
        console.error("Failed loading builder content", e);
      }
    }
  }, [router]);

  const handleChange = (key: keyof typeof DEFAULT_CONTENT, value: string) => {
    setContent((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem("cpp_builder_content", JSON.stringify(content));
    setToastMessage("Changes saved successfully!");
    setIsToastOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("cpp_is_authenticated");
    router.push("/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-light text-rose-700">
        <ShieldAlert className="w-12 h-12" />
        <p className="font-display font-semibold">Redirecting to Login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-[#e4e6ef] overflow-hidden">
      {/* Left Editor Panel */}
      <aside className="w-80 sm:w-96 bg-[#1e1e2d] text-white flex flex-col justify-between shadow-2xl z-20 flex-shrink-0">
        
        {/* Header */}
        <div className="p-6 border-b border-[#323248] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-sm tracking-wider uppercase text-white/95">Site Builder</span>
          </div>
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white px-2 py-1 flex items-center gap-1.5" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>

        {/* Tab Selector Links */}
        <div className="flex border-b border-[#323248] text-xs">
          {(["hero", "about", "stats", "volunteer"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center uppercase tracking-wider font-semibold border-b-2 cursor-pointer transition-colors ${
                activeTab === tab ? "border-accent text-white bg-white/5" : "border-transparent text-white/55 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Editor Fields scrollable */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
          {activeTab === "hero" && (
            <div className="flex flex-col gap-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a2a3b7]">Hero Section</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Main Heading</label>
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={(e) => handleChange("heroTitle", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Sub-Description</label>
                <textarea
                  value={content.heroDesc}
                  rows={4}
                  onChange={(e) => handleChange("heroDesc", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="flex flex-col gap-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a2a3b7]">About Section</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Paragraph 1 (Highlights)</label>
                <textarea
                  value={content.aboutContent1}
                  rows={3}
                  onChange={(e) => handleChange("aboutContent1", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Paragraph 2</label>
                <textarea
                  value={content.aboutContent2}
                  rows={4}
                  onChange={(e) => handleChange("aboutContent2", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Paragraph 3</label>
                <textarea
                  value={content.aboutContent3}
                  rows={4}
                  onChange={(e) => handleChange("aboutContent3", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="flex flex-col gap-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a2a3b7]">Counters</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-[#a2a3b7] font-semibold">Workshops</label>
                  <input
                    type="text"
                    value={content.stat1}
                    onChange={(e) => handleChange("stat1", e.target.value)}
                    className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent text-center font-bold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-[#a2a3b7] font-semibold">Participants</label>
                  <input
                    type="text"
                    value={content.stat2}
                    onChange={(e) => handleChange("stat2", e.target.value)}
                    className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent text-center font-bold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-[#a2a3b7] font-semibold">Partners</label>
                  <input
                    type="text"
                    value={content.stat3}
                    onChange={(e) => handleChange("stat3", e.target.value)}
                    className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent text-center font-bold"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-[#a2a3b7] font-semibold">Core Pillars</label>
                  <input
                    type="text"
                    value={content.stat4}
                    onChange={(e) => handleChange("stat4", e.target.value)}
                    className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent text-center font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "volunteer" && (
            <div className="flex flex-col gap-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a2a3b7]">Volunteer Testimonials</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Director&apos;s Quote</label>
                <textarea
                  value={content.volunteerQuote}
                  rows={6}
                  onChange={(e) => handleChange("volunteerQuote", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent resize-none font-serif italic"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#2b2b40] border-t border-[#323248] flex flex-col gap-3">
          <Button variant="accent" size="lg" className="w-full justify-center gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" /> Save Changes
          </Button>
          <Link href="/" className="inline-flex items-center justify-center gap-2 text-xs text-[#a2a3b7] hover:text-white py-1 uppercase tracking-wider font-semibold transition-colors duration-200">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to website
          </Link>
        </div>

      </aside>

      {/* Right Canvas Mock Preview */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden p-6 gap-6 relative">
        {/* Device Controls */}
        <div className="flex items-center justify-between bg-white border border-black/5 rounded-2xl px-6 py-3.5 shadow-sm">
          <div className="flex items-center gap-3 text-dark font-semibold text-sm">
            <Eye className="w-4 h-4 text-primary" /> Live Preview Frame
          </div>
          <div className="flex items-center bg-light rounded-xl p-1 gap-1 border border-black/5">
            <button
              onClick={() => setViewMode("desktop")}
              className={`p-2 rounded-lg cursor-pointer ${
                viewMode === "desktop" ? "bg-white text-primary shadow-sm" : "text-gray-text hover:text-dark"
              }`}
              aria-label="Desktop preview"
            >
              <Laptop className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`p-2 rounded-lg cursor-pointer ${
                viewMode === "mobile" ? "bg-white text-primary shadow-sm" : "text-gray-text hover:text-dark"
              }`}
              aria-label="Mobile preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview Frame Wrapper */}
        <div className="flex-grow flex items-center justify-center overflow-hidden">
          <div
            className={`bg-white border border-black/5 rounded-2xl overflow-y-auto shadow-2xl transition-all duration-300 ${
              viewMode === "desktop" ? "w-full h-full max-w-full" : "w-[375px] h-[667px] border-8 border-dark/95 shadow-2xl rounded-[40px] px-1"
            }`}
          >
            {/* Mock Header */}
            <div className="py-4 px-6 border-b border-black/5 bg-[#fcfcfc] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <img src="/assets/current_logo.png" alt="logo" className="w-8 h-8 object-contain" />
                <span className="font-serif text-sm font-bold text-dark">Centre for <span className="text-primary">Peace Praxis</span></span>
              </div>
              <div className="hidden sm:flex gap-4 text-[10px] uppercase font-bold text-dark/70">
                <span>Home</span>
                <span>About</span>
                <span>Workshops</span>
                <span>Volunteer</span>
                <span>Gallery</span>
              </div>
            </div>

            {/* Mock Hero */}
            <div
              className="py-20 px-6 text-center text-white bg-cover bg-center flex flex-col items-center gap-4"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85)), url('/assets/volunteer_bg.jpg')`
              }}
            >
              <span className="text-[10px] font-bold tracking-widest uppercase text-light-blue bg-white/10 px-3 py-1 rounded-full">Welcome To</span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white max-w-xl leading-tight">
                {content.heroTitle}
              </h2>
              <p className="text-xs sm:text-sm text-white/85 max-w-md">
                {content.heroDesc}
              </p>
              <div className="flex gap-3 mt-2 text-xs">
                <span className="px-4 py-1.5 bg-accent rounded-full font-bold text-white shadow-md">Join Our Mission</span>
                <span className="px-4 py-1.5 border border-white rounded-full font-bold text-white">View Workshops</span>
              </div>
            </div>

            {/* Mock Stats */}
            <div className="py-8 bg-gradient-to-r from-primary to-dark text-white text-center px-4 grid grid-cols-4 gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold text-light-blue">{content.stat1}</span>
                <span className="text-[9px] text-white/70 uppercase">Workshops</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold text-light-blue">{content.stat2}</span>
                <span className="text-[9px] text-white/70 uppercase">Participants</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold text-light-blue">{content.stat3}</span>
                <span className="text-[9px] text-white/70 uppercase">Partners</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold text-light-blue">{content.stat4}</span>
                <span className="text-[9px] text-white/70 uppercase">Pillars</span>
              </div>
            </div>

            {/* Mock About */}
            <div className="py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#fcfcfc]">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">About Us</span>
                <h3 className="text-lg font-display font-bold text-dark leading-tight">Our Journey Towards A More Peaceful World</h3>
                <div className="text-xs text-gray-text leading-relaxed flex flex-col gap-2 text-justify">
                  <p className="font-semibold text-primary">{content.aboutContent1}</p>
                  <p>{content.aboutContent2}</p>
                  <p>{content.aboutContent3}</p>
                </div>
              </div>
              <div>
                <img src="/assets/peaceaxis_image1.jpg" alt="About" className="w-full h-auto rounded-xl shadow-md border border-black/5" />
              </div>
            </div>

            {/* Mock Volunteer */}
            <div
              className="py-16 px-6 text-center text-white bg-cover bg-center flex flex-col items-center gap-6"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.95), rgba(38, 70, 83, 0.9)), url('/assets/volunteer_bg.jpg')`
              }}
            >
              <h3 className="text-lg font-display font-bold text-white relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-0.5 after:bg-accent">
                Volunteer With Us
              </h3>
              <div className="w-full max-w-sm bg-white/5 border border-white/10 p-5 rounded-xl text-left flex flex-col gap-3">
                <p className="text-xs italic text-white/90 leading-relaxed font-serif">
                  {content.volunteerQuote}
                </p>
                <div className="flex items-center gap-2 border-t border-white/10 pt-2 text-[10px]">
                  <img src="/assets/peaceaxis_image5.jpg" alt="padma" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold">Dr. Padmakumar MM</h4>
                    <p className="text-white/60">Director, Centre for Peace Praxis</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </main>

      {/* Success Save Toast */}
      <Toast
        message={toastMessage}
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        type="success"
      />
    </div>
  );
}
