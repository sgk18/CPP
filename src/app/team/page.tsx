import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { User } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";

// Force dynamic so that team members are always loaded fresh from the DB
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  let members: any[] = [];
  try {
    members = await prisma.teamMember.findMany({
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.error("Error fetching team members:", err);
  }

  // Find leadership / coordinator if any
  const coordinator = members.find(
    (m) => m.role?.toLowerCase().includes("coordinator") || m.role?.toLowerCase() === "director"
  );
  const generalMembers = members.filter((m) => !coordinator || m.id !== coordinator.id);

  return (
    <>
      <Header />
      <main className="flex-grow pt-[97px] bg-[#fcfcfc]">
        {/* Page Header */}
        <section
          className="relative py-24 px-6 text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85)), url('/assets/volunteer_group.jpg')`,
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Our Team
            </h1>
            <p className="text-lg text-white/80 font-light max-w-xl mx-auto">
              The dedicated educators, students, and community members behind our praxis.
            </p>
          </div>
        </section>

        <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col gap-24">
          {/* Coordinator/Leadership Section */}
          {coordinator && (
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-accent mb-6">
                Leadership
              </span>
              <div className="w-full max-w-sm">
                <Card hoverEffect={true} className="border border-black/5 hover:-translate-y-2 transition-all duration-300">
                  <div className="h-80 relative overflow-hidden bg-primary/10">
                    {coordinator.imageUrl ? (
                      <img
                        src={coordinator.imageUrl}
                        alt={coordinator.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <User size={64} />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-display font-bold text-dark mb-1">
                      {coordinator.name}
                    </h3>
                    <p className="text-sm font-semibold text-accent mb-2">{coordinator.role}</p>

                    {/* Social links */}
                    {(coordinator.linkedin || coordinator.github) && (
                      <div className="flex justify-center gap-4 mt-4">
                        {coordinator.linkedin && (
                          <a
                            href={coordinator.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-primary transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {coordinator.github && (
                          <a
                            href={coordinator.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-primary transition-colors"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* General Members Section */}
          {generalMembers.length > 0 ? (
            <div>
              <div className="text-center max-w-xl mx-auto mb-16">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-dark mb-2">
                  Members & Volunteers
                </h2>
                <div className="h-1 bg-accent w-12 mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {generalMembers.map((v) => (
                  <Card
                    key={v.id}
                    className="hover:-translate-y-2 transition-all duration-300 flex flex-col h-full justify-between border border-black/5"
                  >
                    <div>
                      <div className="h-56 bg-light flex items-center justify-center text-gray-300 overflow-hidden relative">
                        {v.imageUrl ? (
                          <img
                            src={v.imageUrl}
                            alt={v.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <User className="w-16 h-16 text-black/10" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5 text-center">
                        <h4 className="font-display font-bold text-dark text-base mb-1 truncate">
                          {v.name}
                        </h4>
                        <p className="text-xs font-semibold text-accent truncate">{v.role || "Volunteer"}</p>
                      </CardContent>
                    </div>

                    {/* Footer Social link area */}
                    {(v.linkedin || v.github) && (
                      <div className="flex justify-center gap-3 pb-5 pt-2 border-t border-black/[0.03]">
                        {v.linkedin && (
                          <a
                            href={v.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-primary transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {v.github && (
                          <a
                            href={v.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-primary transition-colors"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            !coordinator && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-sm">No team members registered yet.</p>
              </div>
            )
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
