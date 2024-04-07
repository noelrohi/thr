import { projectTable } from "@/db/utils";
import { sql } from "drizzle-orm";
import { serial, text, timestamp, bigint, index } from "drizzle-orm/pg-core";

export const posts = projectTable(
  "posts",
  {
    id: serial("id").notNull().primaryKey(),
    text: text("text").notNull(),
    userId: text("user_id").notNull(),
    parentId: bigint("parent_id", { mode: "number" }),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userIdx: index("userId").on(table.userId),
  }),
);

export const userDetails = projectTable("user_details", {
  id: serial("id").notNull().primaryKey(),
  userId: text("user_id").notNull(),
  fullName: text("full_name").notNull(),
  username: text("username").notNull(),
  bio: text("bio"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});
