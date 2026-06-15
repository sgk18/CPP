/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const EVENTS = [
  {
    title: "Inter-Religious Visit",
    date: new Date("2026-02-20"),
    description: "A one-day visit to multiple religious institutions including Gurudwara, Mahabodhi, and Dharmaram.",
    imageUrl: "/assets/peaceaxis_image11.jpg",
    registrationLink: "",
    venue: "Bengaluru Institutions"
  },
  {
    title: "Film Festival & Panel Discussion",
    date: new Date("2026-02-24"),
    description: "A one-day film screening followed by a panel discussion.",
    imageUrl: "/assets/peaceaxis_image9.jpg",
    registrationLink: "",
    venue: "Main Campus Seminar Hall"
  },
  {
    title: "Psychosocial Well-being Workshop",
    date: new Date("2026-02-19"),
    description: "A 3-hour workshop on \"Resilience and Recovery\" with e-certificates.",
    imageUrl: "/assets/peaceaxis_image12.jpg",
    registrationLink: "",
    venue: "KE Auditorium, Block 4"
  },
  {
    title: "SDG Week – NGO Stalls",
    date: new Date("2026-02-12"),
    description: "NGO stalls to promote sustainable development goals during SDG Week.",
    imageUrl: "/assets/peaceaxis_image6.jpg",
    registrationLink: "",
    venue: "Garden Street"
  },
  {
    title: "Volunteer in Philippines",
    date: new Date("2026-05-12"),
    description: "International volunteering at Mindanao Peacebuilding Institute, May 12-31, 2026.",
    imageUrl: "/assets/volunteer_philippines.jpg",
    registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLScmjweCQfwquN_aHSy9Tz_DkvodQwyqULN-3AQ19-SfWxP2Lw/viewform",
    venue: "Mindanao Peacebuilding Institute, Philippines"
  },
];

const TEAM_MEMBERS = [
  {
    name: "Dr. Padmakumar MM",
    role: "Director",
    imageUrl: "/assets/peaceaxis_image5.jpg",
    linkedin: "https://linkedin.com/in/padmakumar-mm",
    github: ""
  },
  {
    name: "Ravi Ranjan Sharma",
    role: "Student Coordinator",
    imageUrl: "/assets/studentcoordinator.jpg",
    linkedin: "https://linkedin.com/in/ravi-ranjan",
    github: ""
  },
];

function scanDirectory(dir, relativePrefix = "/assets") {
  const absoluteDir = path.isAbsolute(dir) ? dir : path.join(__dirname, dir);
  if (!fs.existsSync(absoluteDir)) return [];

  const files = fs.readdirSync(absoluteDir);
  let results = [];

  for (const file of files) {
    const fullPath = path.join(absoluteDir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(scanDirectory(fullPath, `${relativePrefix}/${file}`));
    } else {
      const ext = path.extname(file).toLowerCase();
      if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
        results.push({
          filename: file,
          url: `${relativePrefix}/${file}`,
        });
      }
    }
  }
  return results;
}

const EXCLUDED_FILES = [
  "logo.png",
  "current_logo.png",
  "favicon.ico",
  "hero_bg.png",
  "dandelion.png",
  "vercel.svg",
  "window.svg",
  "file.svg",
  "globe.svg",
  "next.svg",
  "sdg_week_bg.jpg",
  "volunteer_bg.jpg",
  "role_of_religious_bg.jpg",
  "christ_logo1.png",
  "speaker.jpeg",
  "poster.jpeg",
  "bridging_hearts_poster.png",
  "bridging_hearts_poster.jpg",
  "changing_rains_poster.jpg",
  "story_wheel_poster.jpg",
  "bridging_hearts_poster.jpeg",
  "bhargav_shree_raj.jpg",
  "dhinesh_karthik.jpg",
  "directors_photo.jpg",
  "dr_abilash_k.jpg",
  "dr_padmakumar_mm.jpg",
  "dr_priya_vinod.jpg",
  "ravi ranjan.jpeg",
  "studentcoordinator.jpg",
  "suryachalam.jpg",
  "speaker_image.jpg",
  "bridging_hearts.png"
];

function categorizeImage(url, filename, index) {
  let album = "General";
  let caption = "Centre for Peace Praxis Gallery";
  let isFeatured = false;

  const lower = filename.toLowerCase();

  if (lower.startsWith("bridging_hearts")) {
    album = "Events";
    caption = "Bridging Hearts Program";
    if (lower.includes("gallery_1")) isFeatured = true;
  } else if (lower.startsWith("changing_rains")) {
    album = "Events";
    caption = "Changing Rains Event";
    if (lower.includes("event_photo")) isFeatured = true;
  } else if (lower.startsWith("dares_diff")) {
    album = "Events";
    caption = "Dares and Differences Workshop";
  } else if (lower.startsWith("story_wheel")) {
    album = "Events";
    caption = "Story Wheel Activity";
    if (lower.includes("hero")) isFeatured = true;
  } else if (lower.includes("inaugration") || url.includes("/inaugration/")) {
    album = "Events";
    caption = "CPP Inauguration 2023";
  } else if (lower.includes("orientation_workshop")) {
    album = "Workshops";
    caption = "Orientation Workshop Session";
  } else if (lower.includes("studentcoordinator") || lower.includes("suryachalam") || lower.includes("ravi ranjan")) {
    album = "Leadership";
    caption = "CPP Team Coordinator";
  } else if (lower.includes("volunteer")) {
    album = "Volunteers";
    caption = "Volunteers Group Photo";
    if (lower.includes("philippines")) isFeatured = true;
  } else if (lower.startsWith("peaceaxis_image")) {
    // Specific maps
    if (lower.includes("image5")) {
      album = "Leadership";
      caption = "Director addressing participants";
      isFeatured = true;
    } else if (lower.includes("image6")) {
      album = "Events";
      caption = "SDG Week NGO Stalls";
    } else if (lower.includes("image9")) {
      album = "Events";
      caption = "Film Festival Panel";
      isFeatured = true;
    } else if (lower.includes("image11")) {
      album = "Events";
      caption = "Inter-Religious Visit";
    } else if (lower.includes("image12")) {
      album = "Events";
      caption = "Psychosocial Workshop";
    } else {
      album = "Events";
      caption = "Peace Axis Event";
    }
  } else if (lower.startsWith("gallery_img_")) {
    album = "General";
    caption = `Gallery Photo - ${filename.split(".")[0].replace("gallery_img_", "")}`;
  } else if (lower.includes("role_gallery") || lower.includes("role_of_religous") || lower.includes("role_of_religious")) {
    album = "General";
    caption = "Role of Religion Seminar";
  } else if (lower.startsWith("stall")) {
    album = "Events";
    caption = "NGO Stalls Exhibition";
  } else {
    // Fallback
    album = "General";
    caption = filename.split(".")[0].split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  return {
    imageUrl: url,
    caption,
    album,
    isFeatured,
    sortOrder: index + 1
  };
}

const rawFiles = scanDirectory("../public/assets");
const filteredFiles = rawFiles.filter(item => !EXCLUDED_FILES.includes(item.filename.toLowerCase()));
const GALLERY = filteredFiles.map((item, idx) => categorizeImage(item.url, item.filename, idx));

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

async function main() {
  try {
    console.log("Cleaning Database...");
    await prisma.event.deleteMany();
    await prisma.teamMember.deleteMany();
    await prisma.gallery.deleteMany();
    await prisma.setting.deleteMany();

    console.log("Seeding Events...");
    for (const e of EVENTS) {
      await prisma.event.create({
        data: e,
      });
    }

    console.log("Seeding Team Members...");
    for (const t of TEAM_MEMBERS) {
      await prisma.teamMember.create({
        data: t,
      });
    }

    console.log("Seeding Gallery...");
    for (const g of GALLERY) {
      await prisma.gallery.create({
        data: g,
      });
    }

    console.log("Seeding Settings...");
    for (const s of SETTINGS) {
      await prisma.setting.upsert({
        where: { key: s.key },
        update: s,
        create: s,
      });
    }

    console.log("Database seeded successfully via Prisma!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
