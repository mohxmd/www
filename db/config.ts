import { defineDb, defineTable, column } from "astro:db";

const Like = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    post: column.text({ unique: true }),
    likes: column.number({ default: 0 }),
  },
});

const PostView = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    post: column.text({ unique: true }),
    views: column.number({ default: 0 }),
  },
});

const User = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    fullName: column.text(),
    email: column.text({ unique: true }),
    password: column.text({ optional: true }),
    githubAuth: column.boolean({ default: false }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { Like, PostView, User },
});
