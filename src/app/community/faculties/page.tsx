"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { ArrowUpRight, Loader2 } from "lucide-react";

type Faculty = {
  id: string;
  name: string;
  role: string;
  department: string;
  campus: string;
  image: string;
  link: string;
};

export default function Faculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculties = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("settings").select("value").eq("key", "faculties").single();
      if (data && data.value) {
        setFaculties(data.value as Faculty[]);
      }
      setLoading(false);
    };
    fetchFaculties();
  }, []);

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
          {loading ? (
            <div className="text-center py-16 text-gray-400 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
              <p>Loading faculties...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {faculties.map((f, idx) => (
                <Card key={idx} className="flex flex-col h-full hover:-translate-y-2 transition-all duration-300">
                  <div className="h-[350px] relative overflow-hidden bg-primary/10">
                    {f.link ? (
                      <a href={f.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                        <img
                          src={f.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=1A5F7A&color=fff`}
                          alt={f.name}
                          className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <img
                        src={f.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=1A5F7A&color=fff`}
                        alt={f.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                        loading="lazy"
                      />
                    )}
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
                    {f.link && (
                      <div>
                        <a href={f.link} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="w-full justify-center gap-1">
                            View Profile <ArrowUpRight className="w-3.5 h-3.5" />
                          </Button>
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {faculties.length === 0 && !loading && (
            <div className="text-center py-16 text-gray-500">
              No faculty members found.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
