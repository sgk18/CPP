"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { faculties } from "@/constants/community";
import { ArrowUpRight } from "lucide-react";

export default function Faculties() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-[97px] bg-[#fcfcfc]">
        {/* Page Header */}
        <section
          className="relative py-24 px-6 text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85)), url('/assets/volunteer_group.jpg')`,
            backgroundAttachment: "fixed"
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Meet Our Faculties
            </h1>
            <p className="text-lg text-white/80 font-light max-w-xl mx-auto">
              The guiding lights behind our mission for peace and resilience.
            </p>
          </div>
        </section>

        {/* Faculties Grid */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {faculties.map((f, idx) => (
              <Card key={idx} className="flex flex-col h-full hover:-translate-y-2 transition-all duration-300">
                <div className="h-[350px] relative overflow-hidden bg-primary/10">
                  <a href={f.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img
                      src={f.image}
                      alt={f.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </a>
                </div>
                <CardContent className="p-6 text-center flex-grow flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-display font-bold text-dark">
                      {f.name}
                    </h3>
                    <p className="text-xs font-bold text-accent uppercase tracking-wider leading-relaxed">
                      {f.role}
                    </p>
                    <p className="text-gray-text text-sm font-medium">
                      {f.department}
                    </p>
                    <p className="text-gray-text text-xs italic">
                      {f.campus}
                    </p>
                  </div>
                  <div>
                    <a href={f.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full justify-center gap-1">
                        View Profile <ArrowUpRight className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  </div>
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
