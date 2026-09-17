"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { logoutAction } from "@/lib/auth-actions";
import {
  Calendar,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Collections",
    items: [
      { href: "/admin/collections/events", icon: Calendar, label: "Events" },
      { href: "/admin/collections/gallery", icon: ImageIcon, label: "Gallery" },
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
            ? "bg-[#1A5F7A]/10 text-[#1a5f7a] border border-[#1a5f7a]/20"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-xl bg-[#1A5F7A]/5 border border-[#1A5F7A]/20"
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          />
        )}
        <Icon className={`relative z-10 w-4.5 h-4.5 flex-shrink-0 ${isActive ? "text-[#1a5f7a]" : "text-gray-400 group-hover:text-gray-600"}`} size={18} />
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
          <div className="absolute left-14 z-50 hidden group-hover:block bg-white border border-gray-200 text-gray-800 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
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
    await logoutAction();
    router.push("/admin/login");
    router.refresh();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-200 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 relative flex-shrink-0">
          <img
            src="/assets/current_logo.png"
            alt="Centre for Peace Praxis Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              <p className="text-gray-900 font-semibold text-sm leading-tight">CPP Admin</p>
              <p className="text-gray-500 text-[10px]">Content Studio</p>
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
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2"
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
      <div className="px-3 pb-4 border-t border-gray-200 pt-4">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 items-center justify-center text-gray-400 hover:text-gray-700 transition-colors shadow-sm"
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
        className="relative hidden lg:flex flex-col h-screen bg-white border-r border-gray-200 flex-shrink-0 overflow-visible"
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
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:hidden"
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
  collapsed: _collapsed,
  mobileOpen,
  setMobileOpen,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith("/admin/collections/events")) return "Events Manager";
    if (pathname.startsWith("/admin/collections/gallery")) return "Gallery Manager";
    return "Admin Content Studio";
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/90 backdrop-blur border-b border-gray-200 flex items-center px-4 gap-4">
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden text-gray-500 hover:text-gray-900 transition-colors"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex-1">
        <h1 className="text-gray-900 font-bold text-sm">{getPageTitle()}</h1>
        <p className="text-gray-500 text-[10px] hidden sm:block">Centre for Peace Praxis · Content Studio</p>
      </div>

    </header>
  );
}
