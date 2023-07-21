"use server";

import { db } from "@/db";
import { likes, reposts, threads } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createThread(
  text: string,
  authorId: string,
  path: string
) {
  await db.insert(threads).values({ authorId, content: text });

  revalidatePath(path);
}

export async function replyToThread(
  text: string,
  authorId: string,
  threadId: number,
  path: string
) {
  await db
    .insert(threads)
    .values({ authorId, content: text, parentId: threadId });

  revalidatePath(path);
}

export async function repostThread(
  id: number,
  reposterId: string,
  path: string
) {
  await db.insert(reposts).values({ reposterId: reposterId, threadId: id });

  revalidatePath(path);
}

export async function deleteThread(id: number, path: string) {
  await db.delete(likes).where(eq(likes.threadId, id));
  await db.delete(threads).where(eq(threads.id, id));
  revalidatePath(path);
}

export async function likeThread(id: number, userId: string, path: string) {
  await db.insert(likes).values({ userId: userId, threadId: id });
  revalidatePath(path);
}

export async function unlikeThread(id: number, userId: string, path: string) {
  await db
    .delete(likes)
    .where(and(eq(likes.threadId, id), eq(likes.userId, userId)));

  revalidatePath(path);
}
