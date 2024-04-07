import { relations } from "drizzle-orm";
import { accounts, users } from "./auth";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));
