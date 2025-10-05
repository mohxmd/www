import { defineDb, defineTable, column, sql, NOW } from "astro:db";

const post_view = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    post: column.text({ unique: true }),
    views: column.number({ default: 0 }),
    created_at: column.date({
      default: sql`CURRENT_TIMESTAMP`,
      optional: true,
    }),
  },
});

const guestbook = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text({ optional: true }),
    message: column.text(),
    published: column.date({ default: NOW }),
  },
});

export default defineDb({
  tables: { post_view, guestbook },
});
