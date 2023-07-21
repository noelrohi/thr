"use server";

import { revalidatePath } from "next/cache";
import { cleanup } from "../utils";
import { db } from "@/db";
import { followers, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs";

export async function changeUsername(
  username: string,
  userId: string,
  path: string
) {
  await db
    .update(users)
    .set({ username: username.toLowerCase() })
    .where(eq(users.clerkId, userId));
  revalidatePath(path);
}

export async function editProfile(
  name: string,
  bio: string,
  userId: string,
  path: string
) {
  await db
    .update(users)
    .set({ name: cleanup(name), bio: cleanup(bio) })
    .where(eq(users.clerkId, userId));

  revalidatePath(path);
}

export async function onboardData(
  username: string,
  name: string,
  bio: string | null,
  image: string,
  userId: string
) {
  await db.insert(users).values({
    clerkId: userId,
    username: username.toLowerCase(),
    name: cleanup(name),
    bio: bio ? cleanup(bio) : null,
    image,
    onboarded: true,
  });
}

export async function followUser(
  userId: string,
  followingId: string,
  path: string
) {
  await db
    .insert(followers)
    .values({ userId: followingId, followerId: userId });

  revalidatePath(path);
}

export async function unfollowUser(
  userId: string,
  followingId: string,
  path: string
) {
  await db
    .delete(followers)
    .where(
      and(eq(followers.followerId, userId), eq(followers.userId, followingId))
    );

  revalidatePath(path);
}
