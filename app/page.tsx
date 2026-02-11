import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import About from "../components/About";
import Pillars from "../components/Pillars";
import UpcomingEvents from "../components/UpcomingEvents";
import Workshops from "../components/Workshops";
import Volunteer from "../components/Volunteer";
import Footer from "../components/Footer";
import AOSInit from "../components/AOSInit";

export default function Home() {
  return (
    <main>
      <AOSInit />
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <About />
      <Pillars />
      <UpcomingEvents />
      <Workshops />
      <Volunteer />
      <Footer />
    </main>
  );
}
