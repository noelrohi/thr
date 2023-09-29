import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  int,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey(),
    clerkId: varchar("clerkId", { length: 191 }).notNull().unique(),
    bio: text("bio"),
    image: text("image").notNull(),
    username: varchar("username", { length: 191 }).notNull(),
    name: text("name").notNull(),
    isEdited: boolean("isEedited").default(false),
    onboarded: boolean("onboarded").default(false),
    isPrivate: boolean("isPrivate").default(false),
    role: text("role", { enum: ["USER", "ADMIN"] }).default("USER"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => ({
    clerkIdx: index("clerkId_idx").on(table.clerkId),
    usernameIdx: index("username_idx").on(table.username),
  })
);

export type Users = typeof users.$inferSelect;

export const followers = mysqlTable(
  "followers",
  {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 191 }).notNull(),
    followerId: varchar("followerId", { length: 191 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    postIdx: index("userId_idx").on(table.userId),
    userIdx: index("followerId_idx").on(table.followerId),
  })
);

export const userRelations = relations(users, ({ many }) => ({
  followers: many(followers),
}));

export const followerRelations = relations(followers, ({ one }) => ({
  user: one(users, {
    fields: [followers.userId],
    references: [users.clerkId],
  }),
}));

export type Followers = typeof followers.$inferSelect;

export const threads = mysqlTable(
  "threads",
  {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    authorId: varchar("authorId", { length: 191 }).notNull(),
    parentId: int("parentId"),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    userIdx: index("authorId_idx").on(table.authorId),
    parentIdx: index("parentId_idx").on(table.parentId),
    authorIdx: index("authorId_idx").on(table.authorId),
  })
);

export const threadsRelations = relations(threads, ({ one, many }) => ({
  likes: many(likes),
  replies: many(threads, { relationName: "replies" }),
  parent: one(threads, {
    fields: [threads.parentId],
    references: [threads.id],
    relationName: "replies",
  }),
  reposts: many(reposts),
  author: one(users, {
    fields: [threads.authorId],
    references: [users.clerkId],
  }),
}));

export type Threads = typeof threads.$inferSelect;

export const likes = mysqlTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    threadId: int("threadId").notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    userIdx: index("userId_idx").on(table.userId),
    threadIdx: index("threadId_idx").on(table.threadId),
  })
);
export type Likes = typeof likes.$inferSelect;

export const likesRelations = relations(likes, ({ one }) => ({
  threads: one(threads, {
    fields: [likes.threadId],
    references: [threads.id],
  }),
}));

export const reposts = mysqlTable(
  "reposts",
  {
    id: serial("id").primaryKey(),
    threadId: int("threadId").notNull(),
    reposterId: varchar("reposterId", { length: 191 }).notNull(),
  },
  (table) => ({
    reposterIdx: index("reposterId_idx").on(table.reposterId),
    threadIdx: index("threadId_idx").on(table.threadId),
  })
);

export const repostsRelations = relations(reposts, ({ one }) => ({
  threads: one(threads, {
    fields: [reposts.threadId],
    references: [threads.id],
  }),
}));

export type Reposts = typeof reposts.$inferSelect;

export const notifications = mysqlTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    senderId: varchar("senderId", { length: 191 }).notNull(),
    receiverId: varchar("receiverId", { length: 191 }).notNull(),
    read: boolean("read").default(false),
    type: text("type", {
      enum: ["LIKE", "REPOST", "FOLLOW", "NEWPOST", "REPLY"],
    }),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
    userId: varchar("userId", { length: 191 }),
    threadId: int("threadId"),
  },
  (table) => ({
    senderIdx: index("senderId_idx").on(table.senderId),
    receiverIdx: index("receiverId_idx").on(table.receiverId),
    userIdx: index("userId_idx").on(table.userId),
    threadIdx: index("threadId_idx").on(table.threadId),
  })
);

export type Notifications = typeof notifications.$inferSelect;
