import { db, PostView } from "astro:db";

export default async function () {
  // Note: This is real data from my previous Astro Studio database
  // Moving to Turso now, so seeding local dev with actual production data
  // This is an open source project, so no sensitive data concerns

  // Seed PostView data
  await db.insert(PostView).values([
    {
      id: 1,
      post: "2024-04-05-how-to-fix-kde-plasma-global-menu-not-working",
      views: 263,
    },
    {
      id: 2,
      post: "2024-04-09-how-to-fix-zsh-icons-in-visual-studio-code-terminal",
      views: 173,
    },
    { id: 3, post: "2024-03-27-the-with-statement-in-python", views: 27 },
    { id: 4, post: "2023-07-19-hello-world", views: 60 },
    { id: 5, post: "2023-07-22-linux-for-beginners", views: 17 },
    {
      id: 6,
      post: "2023-07-21-every-important-http-status-code-explained",
      views: 19,
    },
    {
      id: 7,
      post: "2024-04-13-complete-guide-setting-up-global-user-authentication-context-in-react",
      views: 111,
    },
    {
      id: 8,
      post: "2023-07-22-overcoming-project-roadblocks-for-college-students",
      views: 12,
    },
    {
      id: 9,
      post: "2024-04-19-how-to-install-and-manage-multiple-java-versions-on-linux",
      views: 233,
    },
    {
      id: 10,
      post: "2024-05-02-rust-programming-beginner-friendly-guide-interactive-activities",
      views: 7,
    },
    {
      id: 11,
      post: "2024-07-24-integrating-firebase-auth-into-your-astro-project-with-astro-actions",
      views: 201,
    },
    {
      id: 12,
      post: "2024-08-04-setting-up-a-nodejs-express-project-with-typescript",
      views: 3,
    },
    {
      id: 13,
      post: "2024-08-04-complete-guide-to-setting-up-node-js-express-project-with-typescript",
      views: 217,
    },
    {
      id: 14,
      post: "2024-08-11-getting-started-with-ffmpeg-on-linux-comprehensive-guide",
      views: 96,
    },
    {
      id: 15,
      post: "2024-08-15-understanding-x11-and-wayland-window-servers-behind-your-screen",
      views: 73,
    },
    {
      id: 16,
      post: "2024-08-21-building-my-personal-arch-linux-setup-from-scratch",
      views: 180,
    },
    {
      id: 17,
      post: "2024-08-21-ultimate-guide-to-setting-up-zsh-with-oh-my-zsh-and-powerlevel10k-for-a-stunning-terminal",
      views: 106,
    },
    {
      id: 18,
      post: "2024-10-04-ultimate-guide-setting-up-vps-server-for-beginners",
      views: 116,
    },
    {
      id: 19,
      post: "2024-10-04-simple-nginx-installation-guide-power-up-your-server",
      views: 158,
    },
    {
      id: 20,
      post: "2024-10-04-setting-up-nginx-on-ubuntu-make-your-web-server-awesome",
      views: 226,
    },
    {
      id: 21,
      post: "2024-10-04-adding-rate-limiting-to-nginx-protect-your-website",
      views: 204,
    },
    {
      id: 22,
      post: "2024-10-04-deploy-nodejs-api-nginx-reverse-proxy",
      views: 165,
    },
    {
      id: 23,
      post: "2024-10-04-setting-up-ssl-nginx-ubuntu-secure-site-magic-shield",
      views: 95,
    },
    {
      id: 24,
      post: "2024-10-05-connecting-remote-servers-dolphin-file-manager",
      views: 192,
    },
    {
      id: 25,
      post: "2024-10-15-mern-stack-deployment-from-development-to-production",
      views: 214,
    },
  ]);

  // Initialize Like table (empty for now)
  console.log("Database seeded with PostView data");
}
