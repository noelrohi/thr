import { projectTable } from "@/db/utils";
import { sql } from "drizzle-orm";
import { bigint, index, serial, text, timestamp } from "drizzle-orm/pg-core";

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

export const likes = projectTable(
  "likes",
  {
    id: serial("id").notNull().primaryKey(),
    postId: bigint("post_id", { mode: "number" }).notNull(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (table) => ({
    postIdIdx: index("postId").on(table.postId),
  }),
);

export const userDetails = projectTable("user_details", {
  id: serial("id").notNull().primaryKey(),
  userId: text("user_id").notNull(),
  fullName: text("full_name").notNull(),
  username: text("username").notNull().unique(),
  bio: text("bio"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});

export const savedPosts = projectTable("saved_posts", {
  id: serial("id").notNull().primaryKey(),
  postId: bigint("post_id", { mode: "number" }).notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});

export const followers = projectTable("followers", {
  id: serial("id").notNull().primaryKey(),
  userId: text("user_id").notNull(),
  followerId: text("follower_id").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});
