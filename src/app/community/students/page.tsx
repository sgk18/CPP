"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { User, Code } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";

type Volunteer = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  image_url: string;
  joined_date: string;
  status: string;
  class?: string;
  linkedin?: string;
  github?: string;
  is_coordinator?: boolean;
};

export default function Students() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("volunteers")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: true });
      if (data) setVolunteers(data as Volunteer[]);
      setLoading(false);
    };
    fetchVolunteers();
  }, []);

  const coordinator = volunteers.find(v => v.role === "Student Coordinator" || v.is_coordinator);
  const coreCommittee = volunteers.filter(v => v.department === "Core Committee");
  const developers = volunteers.filter(v => v.role === "Web Developer");
  // Fallback: show all volunteers if no specific categories found
  const regularMembers = volunteers.filter(v =>
    !coordinator || v.id !== coordinator.id &&
    v.department !== "Core Committee" &&
    v.role !== "Web Developer"
  );

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
              Meet Our Students
            </h1>
            <p className="text-lg text-white/80 font-light max-w-xl mx-auto">
              The hearts and hands behind our mission for peace and resilience.
            </p>
          </div>
        </section>

        <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col gap-24">
          
          {/* Coordinator Section */}
          {coordinator && (
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-accent mb-6">Student Leadership</span>
              <div className="w-full max-w-sm">
                <Card className="hover:-translate-y-2 transition-all duration-300">
                  <div className="h-80 relative overflow-hidden bg-primary/10">
                    <img
                      src={coordinator.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(coordinator.name)}&background=1A5F7A&color=fff`}
                      alt={coordinator.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-display font-bold text-dark mb-1">
                      {coordinator.name}
                    </h3>
                    <p className="text-sm font-semibold text-accent mb-1">{coordinator.role}</p>
                    <p className="text-xs text-gray-text font-medium mb-1">{coordinator.department}</p>
                    <p className="text-xs text-gray-text italic">Christ University</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* All Volunteers Section */}
          {volunteers.length > 0 && (
            <div>
              <div className="text-center max-w-xl mx-auto mb-16">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-dark mb-2">
                  Our Volunteers
                </h2>
                <div className="h-1 bg-accent w-12 mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {volunteers.filter(v => !coordinator || v.id !== coordinator.id).map((v, idx) => (
                  <Card key={idx} className="hover:-translate-y-2 transition-all duration-300">
                    <div className="h-56 bg-light flex items-center justify-center text-gray-300">
                      {v.image_url ? (
                        <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-black/10" />
                      )}
                    </div>
                    <CardContent className="p-6 text-center">
                      <h4 className="font-display font-bold text-dark text-base mb-1">
                        {v.name}
                      </h4>
                      <p className="text-xs font-semibold text-accent mb-2">{v.role}</p>
                      <p className="text-xs text-gray-text leading-relaxed font-medium">{v.department}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </section>
      </main>
      <Footer />
    </>
  );
}
