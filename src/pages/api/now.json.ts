import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const now = {
    coding: {
      main: "Oryft – personal e-commerce SaaS project 🛍️",
      side: "Fun experiments & features in (/www) ✨",
      upcoming: [
        "Open-source Comments Platform (modern stack)",
        "Open-source Notification System (reusable architecture 📡)",
      ],
      todo: ["Integrate comments system", "Build /write page for blog ✍️"],
    },
    reading: "Latest Demon Slayer manga chapters 📖",
    hobbies: ["Anime 🎬", "Manga 📚", "Open Source 🐧", "Coding 💻"],
    listening: "Quran 🎧",
    futurePlans: {
      studio: "Planning to start my own dev studio – blend of OSS + SaaS 🌐",
    },
    updatedAt: new Date().toISOString(),
  };

  return new Response(JSON.stringify(now, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
};
