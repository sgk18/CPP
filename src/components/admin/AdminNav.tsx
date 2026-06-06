"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BookOpen,
  ImageIcon,
  Users,
  Quote,
  Mail,
  FolderOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Globe,
  type LucideIcon,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Pages",
    items: [
      { href: "/admin/pages/home", icon: Globe, label: "Homepage" },
      { href: "/admin/pages/about", icon: FileText, label: "About Page" },
    ],
  },
  {
    label: "Collections",
    items: [
      { href: "/admin/collections/events", icon: Calendar, label: "Events" },
      { href: "/admin/collections/workshops", icon: BookOpen, label: "Workshops" },
      { href: "/admin/collections/gallery", icon: ImageIcon, label: "Gallery" },
      { href: "/admin/collections/volunteers", icon: Users, label: "Volunteers" },
      { href: "/admin/collections/testimonials", icon: Quote, label: "Testimonials" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/media", icon: FolderOpen, label: "Media Library" },
      { href: "/admin/settings/contact", icon: Mail, label: "Contact Info" },
      { href: "/admin/settings/seo", icon: Search, label: "SEO Manager" },
    ],
  },
];

function NavLink({
  href,
  icon: Icon,
  label,
  collapsed,
  onClick,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer
          ${isActive
            ? "bg-[#1A5F7A]/30 text-[#2a9d8f] border border-[#2a9d8f]/30"
            : "text-white/50 hover:text-white/90 hover:bg-white/5"
          }`}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-xl bg-[#1A5F7A]/20 border border-[#2a9d8f]/30"
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          />
        )}
        <Icon className={`relative z-10 w-4.5 h-4.5 flex-shrink-0 ${isActive ? "text-[#2a9d8f]" : "text-white/40 group-hover:text-white/70"}`} size={18} />
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              className="relative z-10 text-sm font-medium truncate"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="absolute left-14 z-50 hidden group-hover:block bg-[#0d1f2d] border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
            {label}
          </div>
        )}
      </motion.div>
    </Link>
  );
}

export function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A5F7A] to-[#2a9d8f] flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white text-xs font-bold">CP</span>
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              <p className="text-white font-semibold text-sm leading-tight">CPP Admin</p>
              <p className="text-white/35 text-[10px]">Content Studio</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {NAV_ITEMS.map((section) => (
          <div key={section.label}>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-3 mb-2"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  collapsed={collapsed}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-white/5 pt-4">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0d1f2d] border border-white/10 items-center justify-center text-white/40 hover:text-white/80 transition-colors shadow-lg"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 224 }}
        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
        className="relative hidden lg:flex flex-col h-screen bg-[#060e14]/95 backdrop-blur-xl border-r border-white/[0.06] flex-shrink-0 overflow-visible"
        style={{ position: "sticky", top: 0 }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed left-0 top-0 h-full w-64 bg-[#060e14]/98 backdrop-blur-xl border-r border-white/[0.06] z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function AdminTopBar({
  collapsed,
  mobileOpen,
  setMobileOpen,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);

  const getPageTitle = () => {
    if (pathname === "/admin/dashboard") return "Dashboard";
    if (pathname.startsWith("/admin/pages/home")) return "Homepage Manager";
    if (pathname.startsWith("/admin/pages/about")) return "About Page Manager";
    if (pathname.startsWith("/admin/collections/events")) return "Events Manager";
    if (pathname.startsWith("/admin/collections/workshops")) return "Workshop Manager";
    if (pathname.startsWith("/admin/collections/gallery")) return "Gallery Manager";
    if (pathname.startsWith("/admin/collections/volunteers")) return "Volunteer Manager";
    if (pathname.startsWith("/admin/collections/testimonials")) return "Testimonials Manager";
    if (pathname.startsWith("/admin/media")) return "Media Library";
    if (pathname.startsWith("/admin/settings/contact")) return "Contact Manager";
    if (pathname.startsWith("/admin/settings/seo")) return "SEO Manager";
    return "Admin";
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#060e14]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-4 gap-4">
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden text-white/50 hover:text-white transition-colors"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex-1">
        <h1 className="text-white font-semibold text-sm">{getPageTitle()}</h1>
        <p className="text-white/30 text-[10px] hidden sm:block">Centre for Peace Praxis · Content Studio</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all relative">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2a9d8f]" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A5F7A] to-[#2a9d8f] flex items-center justify-center text-white text-xs font-bold shadow">
          A
        </div>
      </div>
    </header>
  );
}
