import { relations } from "drizzle-orm";
import { accounts, users } from "./auth";
import { likes, posts, savedPosts, userDetails } from "./main";

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  details: one(userDetails),
  posts: many(posts),
  likedPosts: many(posts),
  savedPosts: many(savedPosts),
}));

export const savedPostsRelations = relations(savedPosts, ({ one }) => ({
  post: one(posts, {
    fields: [savedPosts.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [savedPosts.userId],
    references: [users.id],
  }),
}));

export const likesRelations = relations(likes, ({ many, one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

export const userDetailsRelations = relations(userDetails, ({ many, one }) => ({
  user: one(users, {
    fields: [userDetails.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ many, one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  likes: many(likes),
  replies: many(posts, { relationName: "replies" }),
  parent: one(posts, {
    fields: [posts.parentId],
    references: [posts.id],
    relationName: "replies",
  }),
}));
