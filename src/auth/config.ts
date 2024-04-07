import type { DefaultSession } from "@auth/core/types";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";

import { db, tableCreator } from "@/db";

import { env } from "@/env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  adapter: DrizzleAdapter(db, tableCreator),
  providers: [],
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const isOnHomePage = nextUrl.pathname === "/";
      if (isOnHomePage) {
        if (isLoggedIn) return true;
        return false;
      }
      if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
      return true;
    },
  },
} satisfies NextAuthConfig;
