"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem("cpp_is_authenticated");
    if (auth === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (username.trim() === "admin" && password.trim() === "admin") {
      setIsLoading(true);
      localStorage.setItem("cpp_is_authenticated", "true");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      setShake(true);
      setError(true);
      setPassword("");
      setTimeout(() => setShake(false), 500); // clear shake
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center py-12 px-6 bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85)), url('/assets/volunteer_bg.jpg')`
      }}
    >
      {/* Dynamic Background Pulses */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl animate-pulse-subtle pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-accent/15 blur-3xl animate-pulse-subtle pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div
          className={`glass rounded-3xl p-8 sm:p-10 text-center flex flex-col gap-6 shadow-2xl border-white/40 ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* Badge Icon */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center border border-primary/10 bg-[#fcfcfc] mx-auto shadow-md p-1.5">
            <img
              src="/assets/current_logo.png"
              alt="Centre for Peace Praxis Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-bold tracking-wider text-dark uppercase">
              Admin Access
            </h1>
            <p className="text-xs text-gray-text font-medium uppercase tracking-wider">
              Centre for Peace Praxis
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
            {/* Username */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-black/10 rounded-2xl text-sm outline-none transition-all focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/5 placeholder:text-gray-text/60"
              />
              <User className="w-5 h-5 text-gray-text/60 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                required
                className="w-full pl-12 pr-12 py-3.5 bg-white/60 border border-black/10 rounded-2xl text-sm outline-none transition-all focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/5 placeholder:text-gray-text/60"
              />
              <Lock className="w-5 h-5 text-gray-text/60 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-text/60 hover:text-primary transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Link */}
            <div className="text-right">
              <span className="text-xs text-gray-text hover:text-accent font-medium cursor-pointer transition-colors">
                Forgot Password?
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Invalid credentials. Use admin / admin.</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 justify-center shadow-lg shadow-primary/30"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Accessing...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Go Back Link */}
          <div className="mt-4 pt-4 border-t border-black/5">
            <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-text hover:text-primary font-bold tracking-wide uppercase transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to site
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
