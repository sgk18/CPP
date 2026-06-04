"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { alumni } from "@/constants/community";

export default function Alumni() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-[97px] bg-[#fcfcfc]">
        {/* Page Header */}
        <section
          className="relative py-24 px-6 text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85)), url('/assets/role_of_religious_bg.jpg')`
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Our Alumni
            </h1>
            <p className="text-lg text-white/80 font-light max-w-xl mx-auto">
              Graduates who continue to carry the torch of peace and resilience in the wider world.
            </p>
          </div>
        </section>

        {/* Alumni Grid */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {alumni.map((a, idx) => (
              <Card key={idx} className="hover:-translate-y-2 transition-all duration-300">
                <div className="h-[350px] relative overflow-hidden bg-primary/10">
                  <img
                    src={a.image}
                    alt={a.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-display font-bold text-dark mb-1">
                    {a.name}
                  </h3>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Alumni member</p>
                  <p className="text-xs text-gray-text">Centre for Peace Praxis</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
