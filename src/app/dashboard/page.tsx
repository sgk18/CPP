"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Save, ShieldAlert, ArrowLeft, Laptop, Smartphone, Eye, Globe, Heart, Newspaper, Leaf, HeartHandshake, GraduationCap, Sparkles } from "lucide-react";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

// Expanded flat schema of editable content keys
const DEFAULT_CONTENT = {
  // Hero
  heroTitle: "Hope, Healing & Resilience",
  heroDesc: "Building communities through peace literacy, intercultural dialogue, and collective well-being since 2023.",
  
  // Why Us
  whyTitle: "Why Centre for Peace Praxis?",
  whyDesc: "Empowering individuals to become agents of positive change.",
  feature1Title: "Make a Real Difference!",
  feature1Desc: "Contribute to meaningful peacebuilding initiatives that create lasting impact locally and globally.",
  feature2Title: "Build Capacity!",
  feature2Desc: "Develop essential skills in communication, teamwork, creativity, and conflict resolution.",
  feature3Title: "Have Fun!",
  feature3Desc: "Connect with like-minded people, work on creative projects, and be part of a vibrant community.",
  
  // Stats
  stat1Value: "20+",
  stat1Label: "Activities Conducted",
  stat2Value: "1000+",
  stat2Label: "Participants",
  stat3Value: "15+",
  stat3Label: "Partner Organizations",
  stat4Value: "4",
  stat4Label: "Core Pillars",
  
  // About
  aboutBadge: "About Us",
  aboutTitle: "Our Journey Towards A More Peaceful World",
  aboutContent1: "Established in 2023, the Centre for Peace Praxis aims at building communities of hope, healing, and resilience.",
  aboutContent2: "We believe that peace is not just the absence of conflict, but the presence of justice, understanding, and active cooperation. To achieve this, we organize regular workshops, dialogues, and events that spread peace literacy.",
  aboutContent3: "Aligned with our pillars—Media Literacy, Psychosocial Support, Intercultural Dialogue, and Ecological Wellbeing—we create environments where diversity is embraced as a strength.",
  
  // Pillars
  pillarsBadge: "The Foundation",
  pillarsTitle: "Our Core Pillars",
  pillarsDesc: "The foundation of our approach to peacebuilding.",
  pillar1Title: "Intercultural Dialogue",
  pillar1Desc: "Fostering understanding and respect across diverse cultures, beliefs, and backgrounds through open conversations.",
  pillar2Title: "Psycho-social Well-being",
  pillar2Desc: "Supporting mental and emotional health through community-based approaches to healing and resilience.",
  pillar3Title: "Media Literacy",
  pillar3Desc: "Developing critical thinking skills to navigate today's complex media landscape and counter misinformation.",
  pillar4Title: "Eco-consciousness",
  pillar4Desc: "Promoting environmental awareness and sustainable practices as integral components of peace.",
  
  // Upcoming Events Header
  eventsBadge: "Calendar",
  eventsTitle: "Upcoming Events",
  eventsDesc: "Mark your calendars and join us!",
  
  // Event 1
  event1Title: "Inter-Religious Visit",
  event1Date: "20 Feb 2026",
  event1Desc: "A one-day visit to multiple religious institutions including Gurudwara, Mahabodhi, and Dharmaram. Participation from students and faculty.",
  event1Image: "/assets/peaceaxis_image11.jpg",
  
  // Event 2
  event2Title: "Film Festival & Panel Discussion",
  event2Date: "24 Feb 2026",
  event2Desc: "A one-day film screening followed by a panel discussion, scheduled for 24th February 2026.",
  event2Image: "/assets/peaceaxis_image9.jpg",
  
  // Event 3
  event3Title: "Psychosocial Well-being Workshop",
  event3Date: "19 Feb 2026",
  event3Desc: "A 3-hour workshop on “Resilience and Recovery” with e-certificates and student coordinators from each campus.",
  event3Image: "/assets/peaceaxis_image12.jpg",
  
  // Event 4
  event4Title: "SDG Week – NGO Stalls",
  event4Date: "SDG Week",
  event4Desc: "NGO stalls to be set up during SDG Week in the second week of February 2026 to promote sustainable development goals.",
  event4Image: "/assets/peaceaxis_image6.jpg",
  
  // Event 5
  event5Title: "Volunteer in Philippines",
  event5Date: "May 2026",
  event5Desc: "International volunteering opportunity from May 12-31, 2026 at Mindanao Peacebuilding Institute.",
  event5Image: "/assets/volunteer_philippines.jpg",
  
  // Volunteer
  volunteerTitle: "Volunteer With Us",
  volunteerDesc: "Volunteering at the Centre for Peace Praxis is your chance to make a real difference. Through our Christites for Peace program, we train student representatives in the foundations of peacebuilding to lead university-wide peace initiatives.",
  volunteerQuote: "“Peace is hard-earned, intentional, and sustained through listening, inclusion, and hope.”",
  coordinator1Name: "Dr. Padmakumar MM",
  coordinator1Role: "Director, Centre for Peace Praxis",
  coordinator1Image: "/assets/peaceaxis_image5.jpg",
  coordinator2Name: "Ravi Ranjan Sharma",
  coordinator2Role: "Student Coordinator, Centre for Peace Praxis",
  coordinator2Image: "/assets/studentcoordinator.jpg",
  volunteerFormLink: "https://docs.google.com/forms/d/e/1FAIpQLScmjweCQfwquN_aHSy9Tz_DkvodQwyqULN-3AQ19-SfWxP2Lw/viewform?usp=sf_link"
};

const parseEventDate = (dateStr: string): Date => {
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return new Date(parsed);
  
  const lower = dateStr.toLowerCase();
  if (lower.includes("sdg week")) {
    return new Date("2026-02-12"); // mid-Feb 2026 fallback
  }
  if (lower.includes("may 2026")) {
    return new Date("2026-05-01");
  }
  return new Date(9999, 11, 31);
};

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [activeTab, setActiveTab] = useState<"hero_about" | "features_pillars" | "stats_volunteer" | "events">("hero_about");
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

  // Prep mockup arrays inside the editor
  const mockFeatures = [
    { title: content.feature1Title, desc: content.feature1Desc, icon: <HeartHandshake className="w-6 h-6 text-primary" /> },
    { title: content.feature2Title, desc: content.feature2Desc, icon: <GraduationCap className="w-6 h-6 text-primary" /> },
    { title: content.feature3Title, desc: content.feature3Desc, icon: <Sparkles className="w-6 h-6 text-primary" /> }
  ];

  const mockPillars = [
    { title: content.pillar1Title, desc: content.pillar1Desc, icon: <Globe className="w-5 h-5 text-secondary" /> },
    { title: content.pillar2Title, desc: content.pillar2Desc, icon: <Heart className="w-5 h-5 text-secondary" /> },
    { title: content.pillar3Title, desc: content.pillar3Desc, icon: <Newspaper className="w-5 h-5 text-secondary" /> },
    { title: content.pillar4Title, desc: content.pillar4Desc, icon: <Leaf className="w-5 h-5 text-secondary" /> }
  ];

  const mockEvents = [
    { title: content.event1Title, date: content.event1Date, desc: content.event1Desc, image: content.event1Image },
    { title: content.event2Title, date: content.event2Date, desc: content.event2Desc, image: content.event2Image },
    { title: content.event3Title, date: content.event3Date, desc: content.event3Desc, image: content.event3Image },
    { title: content.event4Title, date: content.event4Date, desc: content.event4Desc, image: content.event4Image },
    { title: content.event5Title, date: content.event5Date, desc: content.event5Desc, image: content.event5Image }
  ];

  const sortedMockEvents = [...mockEvents].sort((a, b) => {
    return parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime();
  });

  return (
    <div className="min-h-screen w-full flex bg-[#e4e6ef] overflow-hidden">
      {/* Left Editor Panel */}
      <aside className="w-80 sm:w-96 bg-[#1e1e2d] text-white flex flex-col justify-between shadow-2xl z-20 flex-shrink-0">
        
        {/* Header */}
        <div className="p-6 border-b border-[#323248] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-xs tracking-wider uppercase text-white/95">Site Builder</span>
          </div>
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white px-2 py-1 flex items-center gap-1.5" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>

        {/* Tab Selector Links */}
        <div className="flex border-b border-[#323248] text-[9px] sm:text-[11px]">
          {(
            [
              { id: "hero_about", label: "Hero & About" },
              { id: "features_pillars", label: "Features & Pillars" },
              { id: "stats_volunteer", label: "Stats & Volunteer" },
              { id: "events", label: "Events" }
            ] as { id: "hero_about" | "features_pillars" | "stats_volunteer" | "events"; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center uppercase tracking-wider font-semibold border-b-2 cursor-pointer transition-colors ${
                activeTab === tab.id ? "border-accent text-white bg-white/5" : "border-transparent text-white/55 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Fields scrollable */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
          {activeTab === "hero_about" && (
            <div className="flex flex-col gap-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a2a3b7]">Hero Section</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Hero Heading</label>
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={(e) => handleChange("heroTitle", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Hero Sub-Description</label>
                <textarea
                  value={content.heroDesc}
                  rows={3}
                  onChange={(e) => handleChange("heroDesc", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a2a3b7] border-t border-[#323248] pt-4 mt-2">About Section</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">About Badge</label>
                <input
                  type="text"
                  value={content.aboutBadge}
                  onChange={(e) => handleChange("aboutBadge", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">About Main Title</label>
                <input
                  type="text"
                  value={content.aboutTitle}
                  onChange={(e) => handleChange("aboutTitle", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Paragraph 1 (Bold Highlight)</label>
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
                  rows={3}
                  onChange={(e) => handleChange("aboutContent2", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Paragraph 3</label>
                <textarea
                  value={content.aboutContent3}
                  rows={3}
                  onChange={(e) => handleChange("aboutContent3", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === "features_pillars" && (
            <div className="flex flex-col gap-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a2a3b7]">Why Us Section</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Why Us Title</label>
                <input
                  type="text"
                  value={content.whyTitle}
                  onChange={(e) => handleChange("whyTitle", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Why Us Description</label>
                <input
                  type="text"
                  value={content.whyDesc}
                  onChange={(e) => handleChange("whyDesc", e.target.value)}
                  className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-accent uppercase">Feature 1 (Make Difference)</span>
                <input type="text" value={content.feature1Title} onChange={(e) => handleChange("feature1Title", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" placeholder="Title" />
                <textarea value={content.feature1Desc} rows={2} onChange={(e) => handleChange("feature1Desc", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white resize-none" placeholder="Description" />
              </div>
              <div className="flex flex-col gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-accent uppercase">Feature 2 (Build Capacity)</span>
                <input type="text" value={content.feature2Title} onChange={(e) => handleChange("feature2Title", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" placeholder="Title" />
                <textarea value={content.feature2Desc} rows={2} onChange={(e) => handleChange("feature2Desc", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white resize-none" placeholder="Description" />
              </div>
              <div className="flex flex-col gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-accent uppercase">Feature 3 (Have Fun)</span>
                <input type="text" value={content.feature3Title} onChange={(e) => handleChange("feature3Title", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" placeholder="Title" />
                <textarea value={content.feature3Desc} rows={2} onChange={(e) => handleChange("feature3Desc", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white resize-none" placeholder="Description" />
              </div>

              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a2a3b7] border-t border-[#323248] pt-4 mt-2">Core Pillars Section</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Pillars Badge</label>
                <input type="text" value={content.pillarsBadge} onChange={(e) => handleChange("pillarsBadge", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Pillars Title</label>
                <input type="text" value={content.pillarsTitle} onChange={(e) => handleChange("pillarsTitle", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Pillars Description</label>
                <input type="text" value={content.pillarsDesc} onChange={(e) => handleChange("pillarsDesc", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white" />
              </div>

              <div className="flex flex-col gap-2 border-l border-accent/40 pl-3">
                <span className="text-[10px] font-bold text-accent uppercase">Pillar 1 Title & Description</span>
                <input type="text" value={content.pillar1Title} onChange={(e) => handleChange("pillar1Title", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" />
                <textarea value={content.pillar1Desc} rows={2} onChange={(e) => handleChange("pillar1Desc", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white resize-none" />
              </div>
              <div className="flex flex-col gap-2 border-l border-accent/40 pl-3">
                <span className="text-[10px] font-bold text-accent uppercase">Pillar 2 Title & Description</span>
                <input type="text" value={content.pillar2Title} onChange={(e) => handleChange("pillar2Title", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" />
                <textarea value={content.pillar2Desc} rows={2} onChange={(e) => handleChange("pillar2Desc", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white resize-none" />
              </div>
              <div className="flex flex-col gap-2 border-l border-accent/40 pl-3">
                <span className="text-[10px] font-bold text-accent uppercase">Pillar 3 Title & Description</span>
                <input type="text" value={content.pillar3Title} onChange={(e) => handleChange("pillar3Title", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" />
                <textarea value={content.pillar3Desc} rows={2} onChange={(e) => handleChange("pillar3Desc", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white resize-none" />
              </div>
              <div className="flex flex-col gap-2 border-l border-accent/40 pl-3">
                <span className="text-[10px] font-bold text-accent uppercase">Pillar 4 Title & Description</span>
                <input type="text" value={content.pillar4Title} onChange={(e) => handleChange("pillar4Title", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" />
                <textarea value={content.pillar4Desc} rows={2} onChange={(e) => handleChange("pillar4Desc", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white resize-none" />
              </div>
            </div>
          )}

          {activeTab === "stats_volunteer" && (
            <div className="flex flex-col gap-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a2a3b7]">Counters</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <label className="text-[10px] text-[#a2a3b7] font-semibold">Stat 1 Value</label>
                  <input type="text" value={content.stat1Value} onChange={(e) => handleChange("stat1Value", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-1.5 text-xs text-white font-bold text-center" />
                  <label className="text-[9px] text-[#a2a3b7] font-semibold">Stat 1 Label</label>
                  <input type="text" value={content.stat1Label} onChange={(e) => handleChange("stat1Label", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-2 py-1 text-[10px] text-white" />
                </div>
                <div className="flex flex-col gap-2 p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <label className="text-[10px] text-[#a2a3b7] font-semibold">Stat 2 Value</label>
                  <input type="text" value={content.stat2Value} onChange={(e) => handleChange("stat2Value", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-1.5 text-xs text-white font-bold text-center" />
                  <label className="text-[9px] text-[#a2a3b7] font-semibold">Stat 2 Label</label>
                  <input type="text" value={content.stat2Label} onChange={(e) => handleChange("stat2Label", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-2 py-1 text-[10px] text-white" />
                </div>
                <div className="flex flex-col gap-2 p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <label className="text-[10px] text-[#a2a3b7] font-semibold">Stat 3 Value</label>
                  <input type="text" value={content.stat3Value} onChange={(e) => handleChange("stat3Value", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-1.5 text-xs text-white font-bold text-center" />
                  <label className="text-[9px] text-[#a2a3b7] font-semibold">Stat 3 Label</label>
                  <input type="text" value={content.stat3Label} onChange={(e) => handleChange("stat3Label", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-2 py-1 text-[10px] text-white" />
                </div>
                <div className="flex flex-col gap-2 p-2.5 bg-white/5 rounded-xl border border-white/5">
                  <label className="text-[10px] text-[#a2a3b7] font-semibold">Stat 4 Value</label>
                  <input type="text" value={content.stat4Value} onChange={(e) => handleChange("stat4Value", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-1.5 text-xs text-white font-bold text-center" />
                  <label className="text-[9px] text-[#a2a3b7] font-semibold">Stat 4 Label</label>
                  <input type="text" value={content.stat4Label} onChange={(e) => handleChange("stat4Label", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-2 py-1 text-[10px] text-white" />
                </div>
              </div>

              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a2a3b7] border-t border-[#323248] pt-4 mt-2">Volunteer Section</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Volunteer Section Title</label>
                <input type="text" value={content.volunteerTitle} onChange={(e) => handleChange("volunteerTitle", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Volunteer Description</label>
                <textarea value={content.volunteerDesc} rows={4} onChange={(e) => handleChange("volunteerDesc", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white resize-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Testimonial Quote</label>
                <textarea value={content.volunteerQuote} rows={3} onChange={(e) => handleChange("volunteerQuote", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white resize-none font-serif italic" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Volunteer Registration Form Link</label>
                <input type="text" value={content.volunteerFormLink} onChange={(e) => handleChange("volunteerFormLink", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white" />
              </div>

              <div className="flex flex-col gap-2 border-l border-accent/40 pl-3">
                <span className="text-[10px] font-bold text-accent uppercase">Coordinator 1 (Dr. Padmakumar)</span>
                <input type="text" value={content.coordinator1Name} onChange={(e) => handleChange("coordinator1Name", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" placeholder="Name" />
                <input type="text" value={content.coordinator1Role} onChange={(e) => handleChange("coordinator1Role", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" placeholder="Role" />
                <input type="text" value={content.coordinator1Image} onChange={(e) => handleChange("coordinator1Image", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" placeholder="Image Path" />
              </div>
              <div className="flex flex-col gap-2 border-l border-accent/40 pl-3">
                <span className="text-[10px] font-bold text-accent uppercase">Coordinator 2 (Ravi Ranjan)</span>
                <input type="text" value={content.coordinator2Name} onChange={(e) => handleChange("coordinator2Name", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" placeholder="Name" />
                <input type="text" value={content.coordinator2Role} onChange={(e) => handleChange("coordinator2Role", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" placeholder="Role" />
                <input type="text" value={content.coordinator2Image} onChange={(e) => handleChange("coordinator2Image", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" placeholder="Image Path" />
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="flex flex-col gap-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#a2a3b7]">Upcoming Events General</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Events Badge</label>
                <input type="text" value={content.eventsBadge} onChange={(e) => handleChange("eventsBadge", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Events Title</label>
                <input type="text" value={content.eventsTitle} onChange={(e) => handleChange("eventsTitle", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[#a2a3b7] font-semibold">Events Sub-Description</label>
                <input type="text" value={content.eventsDesc} onChange={(e) => handleChange("eventsDesc", e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-xl px-4 py-3 text-sm text-white" />
              </div>

              {[
                { label: "Event 1", prefix: "event1" },
                { label: "Event 2", prefix: "event2" },
                { label: "Event 3", prefix: "event3" },
                { label: "Event 4", prefix: "event4" },
                { label: "Event 5", prefix: "event5" }
              ].map((ev) => {
                const titleKey = `${ev.prefix}Title` as keyof typeof DEFAULT_CONTENT;
                const dateKey = `${ev.prefix}Date` as keyof typeof DEFAULT_CONTENT;
                const descKey = `${ev.prefix}Desc` as keyof typeof DEFAULT_CONTENT;
                const imageKey = `${ev.prefix}Image` as keyof typeof DEFAULT_CONTENT;
                
                return (
                  <div key={ev.prefix} className="flex flex-col gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-accent uppercase">{ev.label} Settings</span>
                    <input type="text" value={content[titleKey]} onChange={(e) => handleChange(titleKey, e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" placeholder="Title" />
                    <input type="text" value={content[dateKey]} onChange={(e) => handleChange(dateKey, e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" placeholder="Date (e.g. 20 Feb 2026)" />
                    <textarea value={content[descKey]} rows={2} onChange={(e) => handleChange(descKey, e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white resize-none" placeholder="Description" />
                    <input type="text" value={content[imageKey]} onChange={(e) => handleChange(imageKey, e.target.value)} className="w-full bg-[#2b2b40] border border-[#323248] rounded-lg px-3 py-2 text-xs text-white" placeholder="Image URL Path" />
                  </div>
                );
              })}
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
            <Eye className="w-4 h-4 text-primary" /> Live Preview Frame (Home Page)
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
                <span>Activities</span>
                <span>Volunteer</span>
                <span>Gallery</span>
              </div>
            </div>

            {/* Mock Hero */}
            <div
              className="py-16 px-6 text-center text-white bg-cover bg-center flex flex-col items-center gap-4 animate-fade-in-up"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85)), url('/assets/volunteer_bg.jpg')`
              }}
            >
              <span className="text-[10px] font-bold tracking-widest uppercase text-light-blue bg-white/10 px-3 py-1 rounded-full">Welcome To</span>
              <h2 className="text-xl sm:text-3xl font-display font-extrabold text-white max-w-xl leading-tight">
                {content.heroTitle}
              </h2>
              <p className="text-[10px] sm:text-xs text-white/85 max-w-md">
                {content.heroDesc}
              </p>
            </div>

            {/* Why Us Section */}
            <div className="py-12 px-6 bg-white text-center">
              <h3 className="text-base sm:text-lg font-display font-bold text-dark">{content.whyTitle}</h3>
              <p className="text-[11px] text-gray-text mt-1">{content.whyDesc}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {mockFeatures.map((f, idx) => (
                  <div key={idx} className="border border-black/5 p-4 rounded-xl text-center bg-[#fcfcfc]">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/5 text-primary mx-auto mb-2">
                      {f.icon}
                    </div>
                    <h4 className="text-xs font-bold text-dark">{f.title}</h4>
                    <p className="text-[10px] text-gray-text mt-1 leading-normal">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Stats */}
            <div className="py-8 bg-gradient-to-r from-primary to-dark text-white text-center px-4 grid grid-cols-4 gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm sm:text-base font-bold text-light-blue">{content.stat1Value}</span>
                <span className="text-[8px] text-white/70 uppercase leading-tight">{content.stat1Label}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm sm:text-base font-bold text-light-blue">{content.stat2Value}</span>
                <span className="text-[8px] text-white/70 uppercase leading-tight">{content.stat2Label}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm sm:text-base font-bold text-light-blue">{content.stat3Value}</span>
                <span className="text-[8px] text-white/70 uppercase leading-tight">{content.stat3Label}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm sm:text-base font-bold text-light-blue">{content.stat4Value}</span>
                <span className="text-[8px] text-white/70 uppercase leading-tight">{content.stat4Label}</span>
              </div>
            </div>

            {/* Mock About */}
            <div className="py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#fcfcfc] border-b border-black/5">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{content.aboutBadge}</span>
                <h3 className="text-base sm:text-lg font-display font-bold text-dark leading-tight">{content.aboutTitle}</h3>
                <div className="text-[11px] text-gray-text leading-relaxed flex flex-col gap-2 text-justify">
                  <p className="font-semibold text-primary">{content.aboutContent1}</p>
                  <p>{content.aboutContent2}</p>
                  <p>{content.aboutContent3}</p>
                </div>
              </div>
              <div>
                <img src="/assets/peaceaxis_image1.jpg" alt="About" className="w-full h-auto rounded-xl shadow-md border border-black/5" />
              </div>
            </div>

            {/* Pillars Section */}
            <div className="py-12 px-6 bg-white text-center">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{content.pillarsBadge}</span>
              <h3 className="text-base sm:text-lg font-display font-bold text-dark mt-1">{content.pillarsTitle}</h3>
              <p className="text-[11px] text-gray-text">{content.pillarsDesc}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
                {mockPillars.map((p, idx) => (
                  <div key={idx} className="flex gap-3 p-4 rounded-xl bg-light/35 border border-black/5">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-secondary/10 text-secondary mt-0.5">
                      {p.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary">{p.title}</h4>
                      <p className="text-[10px] text-gray-text mt-1 leading-normal">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Events (DATE SORTED) */}
            <div className="py-12 px-6 bg-light/30 border-t border-black/5 text-center">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{content.eventsBadge}</span>
              <h3 className="text-base sm:text-lg font-display font-bold text-dark mt-1">{content.eventsTitle}</h3>
              <p className="text-[11px] text-gray-text">{content.eventsDesc}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
                {sortedMockEvents.map((evt, idx) => (
                  <div key={idx} className="bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
                    <div className="h-28 relative overflow-hidden bg-primary/10">
                      <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary text-white text-[9px] font-bold rounded-full">
                        {evt.date}
                      </div>
                    </div>
                    <div className="p-3 flex-grow flex flex-col gap-1 justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-dark leading-tight">{evt.title}</h4>
                        <p className="text-[10px] text-gray-text leading-snug mt-1 line-clamp-2">{evt.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Volunteer */}
            <div
              className="py-12 px-6 text-center text-white bg-cover bg-center flex flex-col items-center gap-6"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.95), rgba(38, 70, 83, 0.9)), url('/assets/volunteer_bg.jpg')`
              }}
            >
              <h3 className="text-base sm:text-lg font-display font-bold text-white relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-0.5 after:bg-accent">
                {content.volunteerTitle}
              </h3>
              <p className="text-[11px] text-white/80 max-w-md">{content.volunteerDesc}</p>
              <div className="w-full max-w-sm bg-white/5 border border-white/10 p-5 rounded-xl text-left flex flex-col gap-3">
                <p className="text-xs italic text-white/90 leading-relaxed font-serif">
                  {content.volunteerQuote}
                </p>
                <div className="flex items-center gap-2 border-t border-white/10 pt-2 text-[9px]">
                  <img src={content.coordinator1Image} alt="padma" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold">{content.coordinator1Name}</h4>
                    <p className="text-white/60">{content.coordinator1Role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t border-white/10 pt-2 text-[9px]">
                  <img src={content.coordinator2Image} alt="ravi" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold">{content.coordinator2Name}</h4>
                    <p className="text-white/60">{content.coordinator2Role}</p>
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
