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
      profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber =
            profile.discriminator === "0"
              ? Number(BigInt(profile.id) >> BigInt(22)) % 6
              : Number.parseInt(profile.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith("a_") ? "gif" : "png";
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }
        return {
          id: profile.id,
          name: profile.global_name ?? profile.username,
          email: profile.email,
          image: profile.image_url,
          username: profile.username,
        };
      },
    }),
    GoogleProvider({
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      clientId: env.GOOGLE_CLIENT_ID,
      profile(profile) {
        console.log("google profile", profile);
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.email.replaceAll("@gmail.com", ""),
        };
      },
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
