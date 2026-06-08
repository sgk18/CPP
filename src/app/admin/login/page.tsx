"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // If mockAuth feature is enabled, allow local test credentials.
    if (isFeatureEnabled('mockAuth')) {
      // Local test credentials (for development only)
      if (email === 'admin@gmail.com' && password === '0123456789') {
        router.push('/admin/dashboard');
        router.refresh();
        return;
      } else {
        setError('Invalid mock credentials');
        setLoading(false);
        return;
      }
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#070f16] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#1A5F7A]/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#2a9d8f]/6 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-[#0d1f2d]/60 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/40">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1A5F7A] to-[#2a9d8f] flex items-center justify-center shadow-xl shadow-[#1A5F7A]/30">
              <span className="text-white text-xl font-bold">CP</span>
            </div>
            <div className="text-center">
              <h1 className="text-white font-bold text-xl tracking-tight">Content Studio</h1>
              <p className="text-white/35 text-sm mt-0.5">Centre for Peace Praxis</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" size={16} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-[#2a9d8f]/60 focus:bg-white/[0.06] transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" size={16} />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-[#2a9d8f]/60 focus:bg-white/[0.06] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3 py-2.5 rounded-xl"
              >
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1A5F7A] to-[#2a9d8f] hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#1A5F7A]/20 mt-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              ) : (
                "Sign In to Studio"
              )}
            </button>
          </form>

          <p className="text-center text-white/20 text-xs mt-6">
            Access restricted to authorized staff only.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
