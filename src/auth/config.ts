import { pgDrizzleAdapter as DrizzleAdapter } from "@/auth/adapter";
import { db, tableCreator } from "@/db";
import { env } from "@/env";
import type { Adapter } from "@auth/core/adapters";
import type { DefaultSession } from "@auth/core/types";
import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      bio: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/signin",
  },
  adapter: DrizzleAdapter(db, tableCreator) as unknown as Adapter,
  providers: [],
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        // @ts-expect-error
        username: user.username,
        // @ts-expect-error
        bio: user.bio,
        id: user.id,
      },
    }),
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
