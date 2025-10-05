import { defineAction } from "astro:actions";
import { db, guestbook } from "astro:db";
import { z } from "astro:schema";

export const server = {
  addEntry: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(1, "Name is required"),
      message: z.string().min(1, "Message cannot be empty"),
    }),
    handler: async ({ name, message }) => {
      await db.insert(guestbook).values({ name, message });
    },
  }),
};
