"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/auth-actions";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await loginAction(password);

    if (res.success) {
      router.push("/admin/collections/events");
      router.refresh();
    } else {
      setError(res.error || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8 gap-5">
            <div className="flex items-center justify-center gap-4">
              <img src="/assets/CHRIST_LOGO1.png" alt="Christ University" className="h-12 w-auto object-contain" />
              <div className="w-px h-10 bg-gray-200" />
              <img src="/assets/current_logo.png" alt="Centre for Peace Praxis" className="h-12 w-auto object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-gray-900 font-bold text-xl tracking-tight">Content Studio</h1>
              <p className="text-gray-500 text-sm mt-0.5">Admin Authentication</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-gray-900 text-sm placeholder:text-gray-400 outline-none focus:border-[#1a5f7a] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 text-xs px-3 py-2.5 rounded-xl"
              >
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a5f7a] hover:bg-[#12465a] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm mt-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6">
            Access restricted to authorized staff only.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
