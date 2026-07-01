export const LOCAL_DATABASE_URL = "file:local.db";

type ProcessEnvLike = Record<string, string | undefined>;

export function resolveScriptDatabaseConfig(env: ProcessEnvLike) {
  const useRemote = env.USE_REMOTE_DB === "true";
  const url = useRemote ? env.TURSO_DATABASE_URL : (env.DATABASE_URL ?? LOCAL_DATABASE_URL);
  const authToken = env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("A Turso database URL is required when USE_REMOTE_DB=true.");
  }

  if (!url.startsWith("file:") && !authToken) {
    throw new Error("A Turso auth token is required when USE_REMOTE_DB=true.");
  }

  return { useRemote, url, authToken };
}

export function resolveRuntimeDatabaseConfig({
  databaseUrlOverride,
  isDev,
  tursoUrl,
  tursoAuthToken,
}: {
  databaseUrlOverride: string | undefined;
  isDev: boolean;
  tursoUrl: string | undefined;
  tursoAuthToken: string | undefined;
}) {
  const url =
    databaseUrlOverride ?? (isDev ? LOCAL_DATABASE_URL : (tursoUrl ?? LOCAL_DATABASE_URL));

  return {
    url,
    authToken: url.startsWith("file:") ? undefined : tursoAuthToken,
  };
}
