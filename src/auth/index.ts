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
