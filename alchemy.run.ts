import alchemy from "alchemy";
import { Project, ProjectDomain } from "alchemy/vercel";

const envTargets = ["production", "preview", "development"] as const;

const requiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing ${key}. Set it in your env file or shell before running Alchemy.`);
  }

  return value;
};

const optionalEnv = (key: string) => {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
};

const secretEnv = (key: string) => alchemy.secret(requiredEnv(key));
const optionalSecretEnv = (key: string) => {
  const value = optionalEnv(key);
  return value ? alchemy.secret(value) : undefined;
};

const vercelAccessToken = secretEnv("VERCEL_ACCESS_TOKEN");
const telegramBotToken = optionalSecretEnv("TELEGRAM_BOT_TOKEN");
const telegramAdminUserId = optionalEnv("TELEGRAM_ADMIN_USER_ID");
const telegramWebhookSecret = optionalSecretEnv("TELEGRAM_WEBHOOK_SECRET");

if ((telegramBotToken || telegramAdminUserId || telegramWebhookSecret) && !telegramBotToken) {
  throw new Error("Missing TELEGRAM_BOT_TOKEN. Set it when enabling Telegram chat forwarding.");
}

if ((telegramBotToken || telegramAdminUserId || telegramWebhookSecret) && !telegramAdminUserId) {
  throw new Error("Missing TELEGRAM_ADMIN_USER_ID. Set it when enabling Telegram chat forwarding.");
}

if ((telegramBotToken || telegramAdminUserId || telegramWebhookSecret) && !telegramWebhookSecret) {
  throw new Error("Missing TELEGRAM_WEBHOOK_SECRET. Set it when enabling Telegram chat forwarding.");
}

const app = await alchemy("mohammedsh-www", {
  password: requiredEnv("ALCHEMY_PASSWORD"),
});

const projectName = process.env.VERCEL_PROJECT_NAME ?? "mohammedsh-www";
const projectDomain = process.env.VERCEL_DOMAIN ?? "mohammedsh.xyz";

const project = await Project("mohammedsh-www", {
  accessToken: vercelAccessToken,
  name: projectName,
  framework: "astro",
  gitRepository: {
    type: "github",
    repo: process.env.VERCEL_GIT_REPO ?? "mohammedsh/www",
  },
  installCommand: "bun install --frozen-lockfile",
  buildCommand: "bun run build",
  outputDirectory: "dist",
  devCommand: "bun run dev",
  environmentVariables: [
    {
      key: "USERNAME",
      target: [...envTargets],
      value: process.env.USERNAME ?? "mohxmd",
    },
    ...(process.env.GITHUB_TOKEN
      ? [
          {
            key: "GITHUB_TOKEN",
            target: [...envTargets],
            value: alchemy.secret(process.env.GITHUB_TOKEN),
          },
        ]
      : []),
    {
      key: "TURSO_DATABASE_URL",
      target: [...envTargets],
      value: alchemy.secret(requiredEnv("TURSO_DATABASE_URL")),
    },
    {
      key: "TURSO_AUTH_TOKEN",
      target: [...envTargets],
      value: secretEnv("TURSO_AUTH_TOKEN"),
    },
    {
      key: "CHAT_COOKIE_SECRET",
      target: [...envTargets],
      value: secretEnv("CHAT_COOKIE_SECRET"),
    },
    ...(telegramBotToken
      ? [
          {
            key: "TELEGRAM_BOT_TOKEN",
            target: [...envTargets],
            value: telegramBotToken,
          },
          {
            key: "TELEGRAM_ADMIN_USER_ID",
            target: [...envTargets],
            value: telegramAdminUserId!,
          },
          {
            key: "TELEGRAM_WEBHOOK_SECRET",
            target: [...envTargets],
            value: telegramWebhookSecret!,
          },
        ]
      : []),
  ],
});

export const domain = await ProjectDomain(projectDomain, {
  accessToken: vercelAccessToken,
  name: projectDomain,
  project: project.id,
});

// eslint-disable-next-line no-console
console.log({ project: project.name, domain: domain.name, verified: domain.verified });

await app.finalize();
