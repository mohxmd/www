import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { getDb, guestbook } from "#/db";

export const server = {
  addEntry: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(1, "Name is required"),
      message: z.string().min(1, "Message cannot be empty"),
    }),
    handler: async ({ name, message }) => {
      const db = getDb();
      await db.insert(guestbook).values({ name, message });
    },
  }),
};
