const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const EVENTS = [
  { title: "Inter-Religious Visit", slug: "inter-religious-visit", date: "2026-02-20", description: "A one-day visit to multiple religious institutions including Gurudwara, Mahabodhi, and Dharmaram.", image_url: "/assets/peaceaxis_image11.jpg", registration_link: "", status: "past" },
  { title: "Film Festival & Panel Discussion", slug: "film-festival-and-panel", date: "2026-02-24", description: "A one-day film screening followed by a panel discussion.", image_url: "/assets/peaceaxis_image9.jpg", registration_link: "", status: "past" },
  { title: "Psychosocial Well-being Workshop", slug: "psychosocial-workshop", date: "2026-02-19", description: "A 3-hour workshop on \"Resilience and Recovery\" with e-certificates.", image_url: "/assets/peaceaxis_image12.jpg", registration_link: "", status: "past" },
  { title: "SDG Week – NGO Stalls", slug: "sdg-week", date: "2026-02-12", description: "NGO stalls to promote sustainable development goals during SDG Week.", image_url: "/assets/peaceaxis_image6.jpg", registration_link: "", status: "past" },
  { title: "Volunteer in Philippines", slug: "volunteer-philippines", date: "2026-05-12", description: "International volunteering at Mindanao Peacebuilding Institute, May 12-31, 2026.", image_url: "/assets/volunteer_philippines.jpg", registration_link: "https://docs.google.com/forms/d/e/1FAIpQLScmjweCQfwquN_aHSy9Tz_DkvodQwyqULN-3AQ19-SfWxP2Lw/viewform", status: "upcoming" },
];

const VOLUNTEERS = [
  { name: "Dr. Padmakumar MM", role: "Director", department: "Leadership", email: "director@cpp.in", phone: "", status: "active", image_url: "/assets/peaceaxis_image5.jpg", joined_date: "2023-01-01" },
  { name: "Ravi Ranjan Sharma", role: "Student Coordinator", department: "Coordination", email: "ravi@cpp.in", phone: "", status: "active", image_url: "/assets/studentcoordinator.jpg", joined_date: "2023-06-01" },
];

const TESTIMONIALS = [
  { name: "Dr. Padmakumar MM", role: "Director, CPP", content: "Peace is hard-earned, intentional, and sustained through listening, inclusion, and hope.", avatar_url: "/assets/peaceaxis_image5.jpg", status: "approved" },
  { name: "Ravi Ranjan Sharma", role: "Student Coordinator", content: "This program transformed how I see conflict resolution and community building.", avatar_url: "/assets/studentcoordinator.jpg", status: "approved" },
  { name: "Workshop Participant", role: "Psychosocial Workshop", content: "The resilience workshop gave me tools I use every day. Truly life-changing.", avatar_url: "", status: "pending" },
];

const GALLERY = [
  { image_url: "/assets/peaceaxis_image5.jpg", caption: "Director addressing participants", album: "Leadership", is_featured: true, sort_order: 1 },
  { image_url: "/assets/peaceaxis_image6.jpg", caption: "SDG Week NGO Stalls", album: "Events", is_featured: false, sort_order: 2 },
  { image_url: "/assets/peaceaxis_image9.jpg", caption: "Film Festival Panel", album: "Events", is_featured: true, sort_order: 3 },
  { image_url: "/assets/peaceaxis_image11.jpg", caption: "Inter-Religious Visit", album: "Events", is_featured: false, sort_order: 4 },
  { image_url: "/assets/peaceaxis_image12.jpg", caption: "Psychosocial Workshop", album: "Events", is_featured: false, sort_order: 5 },
  { image_url: "/assets/volunteer_philippines.jpg", caption: "Philippines Volunteering Program", album: "Volunteers", is_featured: true, sort_order: 6 },
];

const PAGES = [
  {
    slug: "home",
    content: {
      heroTitle: "Hope, Healing & Resilience",
      heroDesc: "Building communities through peace literacy, intercultural dialogue, and collective well-being since 2023.",
      whyTitle: "Why Centre for Peace Praxis?",
      whyDesc: "Empowering individuals to become agents of positive change.",
      feature1Title: "Make a Real Difference!",
      feature1Desc: "Contribute to meaningful peacebuilding initiatives that create lasting impact locally and globally.",
      feature2Title: "Build Capacity!",
      feature2Desc: "Develop essential skills in communication, teamwork, creativity, and conflict resolution.",
      feature3Title: "Have Fun!",
      feature3Desc: "Connect with like-minded people, work on creative projects, and be part of a vibrant community.",
      stat1Value: "20+", stat1Label: "Activities Conducted",
      stat2Value: "1000+", stat2Label: "Participants",
      stat3Value: "15+", stat3Label: "Partner Organizations",
      stat4Value: "4", stat4Label: "Core Pillars",
      aboutBadge: "About Us",
      aboutTitle: "Our Journey Towards A More Peaceful World",
      aboutContent1: "Established in 2023, the Centre for Peace Praxis aims at building communities of hope, healing, and resilience.",
      aboutContent2: "We believe that peace is not just the absence of conflict, but the presence of justice, understanding, and active cooperation.",
      aboutContent3: "Aligned with our pillars—Media Literacy, Psychosocial Support, Intercultural Dialogue, and Ecological Wellbeing—we create environments where diversity is embraced as a strength.",
      volunteerTitle: "Volunteer With Us",
      volunteerDesc: "Volunteering at the Centre for Peace Praxis is your chance to make a real difference.",
      volunteerQuote: "“Peace is hard-earned, intentional, and sustained through listening, inclusion, and hope.”",
    },
    seo_title: "Centre for Peace Praxis | Hope, Healing & Resilience",
    seo_description: "Building communities through peace literacy, intercultural dialogue, and collective well-being since 2023.",
    seo_keywords: "peace, dialogue, resilience, Bengaluru, India",
    seo_og_image: "/assets/current_logo.png"
  },
  {
    slug: "about",
    content: {
      missionTitle: "Our Mission",
      mission: "To build communities of hope, healing, and resilience through peace literacy, intercultural dialogue, and collective well-being.",
      visionTitle: "Our Vision",
      vision: "A world where every individual is an active agent of peace — rooted in justice, empathy, and ecological consciousness.",
      storyTitle: "Our Story",
      story: "Established in 2023 at Christ (Deemed to be University), Bengaluru, the Centre for Peace Praxis emerged from the belief that peace education is not a luxury, but a necessity.",
      pillar1Title: "Intercultural Dialogue",
      pillar1Desc: "Fostering understanding and respect across diverse cultures, beliefs, and backgrounds through open conversations.",
      pillar2Title: "Psycho-social Well-being",
      pillar2Desc: "Supporting mental and emotional health through community-based approaches to healing and resilience.",
      pillar3Title: "Media Literacy",
      pillar3Desc: "Developing critical thinking skills to navigate today's complex media landscape and counter misinformation.",
      pillar4Title: "Eco-consciousness",
      pillar4Desc: "Promoting environmental awareness and sustainable practices as integral components of peace.",
      directorName: "Dr. Padmakumar MM",
      directorTitle: "Director, Centre for Peace Praxis",
      directorMessage: "At the Centre for Peace Praxis, we believe that peace begins within — in how we relate to ourselves, to each other, and to the world around us. Our work is grounded in the conviction that peace is not passive, but an active practice of compassion, justice, and hope.",
      directorImage: "/assets/peaceaxis_image5.jpg",
      teamTitle: "Our Team",
      teamDesc: "A dedicated team of educators, students, and community partners committed to peacebuilding.",
    },
    seo_title: "About Us | Centre for Peace Praxis",
    seo_description: "Learn about CPP's mission, vision, and core pillars for peacebuilding.",
    seo_keywords: "about, mission, vision, peace praxis",
    seo_og_image: "/assets/current_logo.png"
  }
];

const SETTINGS = [
  {
    key: "contact",
    value: {
      address: "Centre for Peace Praxis, Christ (Deemed to be University), Hosur Road, Bengaluru – 560029, India",
      email: "peacepraxis@christuniversity.in",
      phone: "+91 80 4012 9100",
      altPhone: "",
      mapLink: "https://maps.google.com/?q=Christ+University+Bengaluru",
      socialLinks: [
        { platform: "Instagram", url: "https://instagram.com/centreforpeacepraxis" },
        { platform: "Facebook", url: "" },
        { platform: "LinkedIn", url: "" },
      ]
    }
  }
];

async function seed() {
  try {
    console.log("Seeding Events...");
    await supabase.from("events").insert(EVENTS);
    
    console.log("Seeding Volunteers...");
    await supabase.from("volunteers").insert(VOLUNTEERS);

    console.log("Seeding Team Members...");
    const teamMembersData = VOLUNTEERS.map(v => ({
      name: v.name,
      role: v.role,
      image_url: v.image_url,
      linkedin: v.linkedin || "",
      github: v.github || ""
    }));
    await supabase.from("team_members").insert(teamMembersData);
    
    console.log("Seeding Testimonials...");
    await supabase.from("testimonials").insert(TESTIMONIALS);
    
    console.log("Seeding Gallery...");
    await supabase.from("gallery").insert(GALLERY);
    
    console.log("Seeding Pages...");
    await supabase.from("pages").insert(PAGES);
    
    console.log("Seeding Settings...");
    await supabase.from("settings").insert(SETTINGS);
    
    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

seed();
