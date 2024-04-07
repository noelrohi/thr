import { now, projectTable } from "@/db/utils";
import { serial, text, timestamp } from "drizzle-orm/pg-core";

export const posts = projectTable("posts", {
  id: serial("id").notNull().primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(now),
  updatedAt: timestamp("updated_at").$onUpdate(() => now),
});
