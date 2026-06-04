"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail } from "lucide-react";

export default function DirectorsNote() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-[97px] bg-[#fcfcfc]">
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Editorial</span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-dark mt-2 mb-4">
                Director’s Note
              </h1>
              <h2 className="text-xl sm:text-2xl font-display font-light text-primary italic">
                “The Hard Road to Peace: Necessary and Possible”
              </h2>
              <div className="h-1 bg-accent w-12 mx-auto mt-6" />
            </div>

            {/* Note Content */}
            <div className="prose max-w-none text-gray-text leading-relaxed text-[15px] sm:text-base flex flex-col gap-6 text-justify">
              
              {/* Responsive photo grid */}
              <div className="w-full md:w-80 md:float-right md:ml-8 mb-6 mx-auto relative group">
                <div className="absolute -inset-2 bg-secondary/5 rounded-2xl -z-10 group-hover:scale-[1.01] transition-transform duration-500" />
                <img
                  src="/assets/directors_photo.jpg"
                  alt="Dr. Padmakumar MM"
                  className="w-full h-auto rounded-xl shadow-lg border border-black/5"
                />
                <p className="text-xs text-center text-gray-text mt-3 font-semibold">Dr. Padmakumar MM</p>
              </div>

              <p>
                Peace is rarely accidental—it is most often hard-earned. While it may appear quiet or effortless from a distance, peace is the result of conscious choices made in moments of uncertainty, conflict, and moral testing. In contrast, it is far easier to bypass life’s deeper complexities: to seek unfair advantage, surrender to impulsive emotions, assert dominance over dialogue, neglect ethical reflection, and gradually normalize cultures of exclusion and violence.
              </p>

              <p>
                Violence, in many forms, is reactive and instinctive. It thrives on fear, anger, and unresolved pain. Peace, however, is deliberate. It demands intention, courage, and sustained commitment. It requires the ability to listen deeply—especially to voices that challenge us—engage in difficult conversations without retreating into hostility, and confront wounds that demand healing rather than denial. Peacebuilding is not passive; it is an active process of creating just, inclusive, and resilient systems. Above all, it requires the audacity to hope for a shared future rooted in dignity, even in the face of adversity.
              </p>

              <p>
                The Centre for Peace Praxis at CHRIST University is grounded in the belief that peace is not merely an emotion, a slogan, or an abstract ideal. Peace is a skill to be learned, a practice to be cultivated, and a culture to be consciously nurtured. Good intentions alone are insufficient. Peacebuilding calls for critical knowledge, practical tools, ethical clarity, and wisdom drawn from lived experiences and global practices committed to collective well-being.
              </p>

              <p>
                The Centre’s work is anchored in four interrelated pillars:
              </p>

              {/* Pillars Box */}
              <div className="bg-secondary/5 border-l-4 border-secondary p-6 rounded-r-2xl my-4">
                <ul className="flex flex-col gap-4 list-none p-0 m-0 text-dark">
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold mt-0.5">•</span>
                    <div>
                      <strong className="text-primary">Intercultural Dialogue</strong>, which fosters mutual understanding across differences;
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold mt-0.5">•</span>
                    <div>
                      <strong className="text-primary">Psycho-social Well-being</strong>, which recognizes healing and mental resilience as foundations of peace;
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold mt-0.5">•</span>
                    <div>
                      <strong className="text-primary">Media Literacy</strong>, which equips individuals to engage critically with information and resist manipulation; and
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold mt-0.5">•</span>
                    <div>
                      <strong className="text-primary">Eco-consciousness</strong>, which affirms that peace with one another is inseparable from peace with the planet.
                    </div>
                  </li>
                </ul>
              </div>

              <p>
                Through capacity-building initiatives, research, and sustained community engagement, the Centre seeks to embed peace within both personal and public spheres—transforming attitudes, practices, and institutions alike.
              </p>

              <p>
                Peace cannot be pursued in isolation. It flourishes when constructive forces converge. The Centre therefore actively collaborates with a wide network of stakeholders, including educational institutions, civil society organizations, government bodies, policymakers, media and creative communities, the private sector, and international development partners. Together, we strive to co-create pathways toward a future grounded in empathy, equity, responsibility, and shared humanity.
              </p>

              <p>
                As peacebuilders, we are reminded that peace does not mean uniform agreement or the absence of disagreement. Rather, peace resembles a shared table—sometimes noisy, sometimes tense—where patience, humility, humor, and mutual respect prevent conflict from turning destructive. It is the courage to stay present, to keep the conversation alive, and to pass the bread even to those with whom we disagree. In that persistence lies the true work—and promise—of peace.
              </p>

              {/* Author Signature */}
              <div className="mt-12 pt-8 border-t border-black/5 flex flex-col items-end text-right gap-1.5">
                <div className="font-display font-bold text-lg text-primary">Dr. Padmakumar MM</div>
                <div className="text-sm text-gray-text font-medium">Director, Centre for Peace Praxis</div>
                <div className="text-sm text-gray-text">Associate Professor, Media Studies</div>
                <a
                  href="mailto:padmakumar@christuniversity.in"
                  className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors mt-2"
                >
                  <Mail className="w-4 h-4" /> padmakumar@christuniversity.in
                </a>
              </div>
              
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
