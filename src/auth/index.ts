import { db } from "@/db";
import { env } from "@/env";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { cache } from "react";
import { authConfig } from "./config";

export type { Session } from "next-auth";

const authResult = NextAuth({
  ...authConfig,
  providers: [
    DiscordProvider({
      clientSecret: env.DISCORD_CLIENT_SECRET,
      clientId: env.DISCORD_CLIENT_ID,
    }),
    GoogleProvider({
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      clientId: env.GOOGLE_CLIENT_ID,
    }),
  ],
});

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
} = authResult;

export const auth = cache(authResult.auth);
export const currentUser = cache(async () => {
  const session = await authResult.auth();
  if (!session) return null;
  const details = await db.query.userDetails.findFirst({
    where: (table, { eq }) => eq(table.userId, session.user.id),
  });
  if (!details) return null;

  return {
    ...details,
    ...session.user,
  };
});
