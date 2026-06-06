"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, Calendar, ImageIcon, BookOpen,
  TrendingUp, ArrowRight, Plus, Edit3,
  Activity, Clock, Globe, Zap, Loader2,
  type LucideIcon
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Stats = {
  events: number;
  volunteers: number;
  gallery: number;
  workshops: number;
};

const QUICK_ACTIONS = [
  { label: "New Event", icon: Plus, href: "/admin/collections/events?new=1", desc: "Create an upcoming event" },
  { label: "Edit Homepage", icon: Globe, href: "/admin/pages/home", desc: "Update hero & sections" },
  { label: "Upload Media", icon: ImageIcon, href: "/admin/media", desc: "Add images to library" },
  { label: "Add Volunteer", icon: Users, href: "/admin/collections/volunteers?new=1", desc: "Register a new volunteer" },
];

const RECENT_ACTIVITY = [
  { action: "Homepage hero updated", user: "Admin", time: "2 hours ago", icon: Edit3 },
  { action: "Inter-Religious Visit event added", user: "Admin", time: "5 hours ago", icon: Calendar },
  { action: "12 new gallery images uploaded", user: "Admin", time: "1 day ago", icon: ImageIcon },
  { action: "Volunteer profile updated", user: "Admin", time: "2 days ago", icon: Users },
  { action: "SEO meta updated for About page", user: "Admin", time: "3 days ago", icon: Activity },
];

function StatCard({ label, value, icon: Icon, change, color, href, loading }: {
  label: string; value: number | string; icon: LucideIcon;
  change: string; color: string; href: string; loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={href}>
        <div className="bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.14] transition-all duration-300 group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
              <Icon size={18} className="text-white" />
            </div>
            <ArrowRight size={14} className="text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {loading ? <Loader2 size={20} className="animate-spin text-white/30" /> : value}
          </p>
          <p className="text-white/50 text-sm font-medium">{label}</p>
          <p className="text-[#2a9d8f] text-xs mt-2 flex items-center gap-1">
            <TrendingUp size={11} /> {change}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [greeting, setGreeting] = useState("Good morning");
  const [stats, setStats] = useState<Stats>({ events: 0, volunteers: 0, gallery: 0, workshops: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    fetchStats();
  }, []);

  const fetchStats = async () => {
    const supabase = createClient();
    const [eventsRes, volunteersRes, galleryRes, workshopsRes] = await Promise.all([
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("volunteers").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("gallery").select("id", { count: "exact", head: true }),
      supabase.from("workshops").select("id", { count: "exact", head: true }),
    ]);
    setStats({
      events: eventsRes.count ?? 0,
      volunteers: volunteersRes.count ?? 0,
      gallery: galleryRes.count ?? 0,
      workshops: workshopsRes.count ?? 0,
    });
    setStatsLoading(false);
  };


  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">{greeting}, Admin 👋</h2>
          <p className="text-white/40 text-sm mt-1">Here's what's happening with CPP content today.</p>
        </div>
        <div className="flex items-center gap-2 text-white/30 text-xs bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2">
          <Clock size={12} />
          <span>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div>
        <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-3">Overview</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Events" value={stats.events} icon={Calendar} change="from database" color="from-[#1A5F7A] to-[#2a9d8f]" href="/admin/collections/events" loading={statsLoading} />
          <StatCard label="Active Volunteers" value={stats.volunteers} icon={Users} change="from database" color="from-[#2a9d8f] to-[#57cc99]" href="/admin/collections/volunteers" loading={statsLoading} />
          <StatCard label="Gallery Images" value={stats.gallery} icon={ImageIcon} change="from database" color="from-[#e9c46a] to-[#f4a261]" href="/admin/collections/gallery" loading={statsLoading} />
          <StatCard label="Workshops" value={stats.workshops} icon={BookOpen} change="from database" color="from-[#f4a261] to-[#e76f51]" href="/admin/collections/workshops" loading={statsLoading} />
        </div>
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="lg:col-span-2 bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <Zap size={16} className="text-[#2a9d8f]" />
            <h3 className="text-white font-semibold text-sm">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1A5F7A]/20 border border-[#1A5F7A]/30 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-[#2a9d8f]" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium group-hover:text-[#2a9d8f] transition-colors">{action.label}</p>
                      <p className="text-white/30 text-xs">{action.desc}</p>
                    </div>
                    <ArrowRight size={12} className="ml-auto text-white/20 group-hover:text-[#2a9d8f] transition-colors" />
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="lg:col-span-3 bg-[#0d1f2d]/60 backdrop-blur border border-white/[0.07] rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-[#2a9d8f]" />
              <h3 className="text-white font-semibold text-sm">Recent Activity</h3>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#2a9d8f] animate-pulse" />
          </div>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-sm truncate">{item.action}</p>
                    <p className="text-white/25 text-xs">{item.user}</p>
                  </div>
                  <p className="text-white/25 text-xs flex-shrink-0 flex items-center gap-1">
                    <Clock size={10} /> {item.time}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Site Status */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-[#1A5F7A]/20 to-[#2a9d8f]/10 border border-[#2a9d8f]/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#57cc99] shadow-[0_0_8px_#57cc99] animate-pulse" />
          <div>
            <p className="text-white font-semibold text-sm">Website is Live</p>
            <p className="text-white/40 text-xs">centreforpeacepraxis.in · All systems operational</p>
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#2a9d8f] text-xs font-semibold hover:text-white transition-colors bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-lg"
        >
          <Globe size={12} /> View Live Site <ArrowRight size={12} />
        </a>
      </motion.div>
    </div>
  );
}
