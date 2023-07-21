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
import { InferModel } from "drizzle-orm";

export const users = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey(),
    clerkId: varchar("clerkId", { length: 191 }).notNull().unique(),
    username: text("username").notNull(),
    isEdited: boolean("isEedited").default(false),
    onboarded: boolean("onboarded").default(false),
    isPrivate: boolean("isPrivate").default(false),
    role: text("role", { enum: ["USER", "ADMIN"] }),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => ({
    clerkIdx: index("clerkId_idx").on(table.clerkId),
  })
);

export type Users = InferModel<typeof users>;

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

export type Followers = InferModel<typeof followers>;

export const threads = mysqlTable(
  "threads",
  {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    authorId: varchar("authorId", { length: 191 }),
    parentId: int("parentId"),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    userIdx: index("authorId_idx").on(table.authorId),
    parentIdx: index("parentId_idx").on(table.parentId),
  })
);

export type Threads = InferModel<typeof threads>;

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
export type Likes = InferModel<typeof likes>;

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

export type Reposts = InferModel<typeof reposts>;

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

export type Notifications = InferModel<typeof notifications>;
