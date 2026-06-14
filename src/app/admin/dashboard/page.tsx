"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, Calendar, ImageIcon, BookOpen,
  TrendingUp, ArrowRight, Clock, Loader2,
  type LucideIcon
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Stats = {
  events: number;
  volunteers: number;
  gallery: number;
  workshops: number;
};

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
        <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-md transition-all duration-300 group cursor-pointer h-full">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
              <Icon size={18} className="text-white" />
            </div>
            <ArrowRight size={14} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? <Loader2 size={20} className="animate-spin text-gray-400" /> : value}
          </p>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-[#1a5f7a] text-xs mt-2 flex items-center gap-1">
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

  async function fetchStats() {
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
          <h2 className="text-2xl font-bold text-gray-900">{greeting}, Admin 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening with CPP content today.</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          <Clock size={12} />
          <span>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Overview</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Events" value={stats.events} icon={Calendar} change="from database" color="from-[#1A5F7A] to-[#2a9d8f]" href="/admin/collections/events" loading={statsLoading} />
          <StatCard label="Active Volunteers" value={stats.volunteers} icon={Users} change="from database" color="from-[#2a9d8f] to-[#57cc99]" href="/admin/collections/volunteers" loading={statsLoading} />
          <StatCard label="Gallery Images" value={stats.gallery} icon={ImageIcon} change="from database" color="from-[#e9c46a] to-[#f4a261]" href="/admin/collections/gallery" loading={statsLoading} />
          <StatCard label="Workshops" value={stats.workshops} icon={BookOpen} change="from database" color="from-[#f4a261] to-[#e76f51]" href="/admin/collections/workshops" loading={statsLoading} />
        </div>
      </div>
    </div>
  );
}
