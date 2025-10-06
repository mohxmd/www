import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const now = {
    bio: "When I was born, the devil said, ‘Oh shit — competition.’ 😏⚔️",
    listening: "Quran 🎧",
    reading: "Latest Demon Slayer manga chapters 📖",
    helping: "I love sharing what I learn — helping others grow sharpens my own edge 🧠✨",
    hobbies: ["Islam 🕊️", "Anime 🎬", "Manga & art 📚", "Coding 💻", "Adventures 🌌"],
    collaboration: {
      lookingFor: "Good friends and passionate devs to build and grow with 🤝",
      vibe: "People who dream big, code clean, and laugh loud ✨",
      note: "Not just teammates — allies in the story. Let’s make something real together ⚔️",
    },
    coding: {
      main: "Oryft – personal e-commerce SaaS project 🛍️",
      side: "Fun experiments & features in (/www) ✨",
      todo: ["Open-source notification system 📡"],
    },
    futurePlans: {
      studio: "Planning to start my own dev studio – blend of OSS + SaaS 🌐",
    },
    message: "It won’t always feel like this. 🌙",
    links: {
      homepage: "https://mohammedsh.xyz",
      blog: "https://mohammedsh.xyz/blog",
      guestbook: "https://mohammedsh.xyz/guestbook",
      chat: "https://t.me/mohammedsh",
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
