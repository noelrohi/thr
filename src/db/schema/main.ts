import { now, projectTable } from "@/db/utils";
import { serial, text, timestamp } from "drizzle-orm/pg-core";

export const posts = projectTable("posts", {
  id: serial("id").notNull().primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(now),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});

export const userDetails = projectTable("user_details", {
  id: serial("id").notNull().primaryKey(),
  userId: text("user_id").notNull(),
  fullName: text("full_name").notNull(),
  username: text("username").notNull(),
  bio: text("bio"),
  createdAt: timestamp("created_at").default(now),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});
