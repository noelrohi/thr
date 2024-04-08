"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { followers, likes, posts, userDetails } from "@/db/schema/main";
import { unkey } from "@/lib/unkey";
import { decode } from "decode-formdata";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type State =
  | {
      message: string | undefined;
      success: boolean | undefined;
    }
  | undefined;

const createPostSchema = z.object({
  posts: z.array(
    z.object({ text: z.string().max(200), isParent: z.coerce.boolean() }),
  ),
});

export async function createThread(
  values: Array<Omit<typeof posts.$inferInsert, "userId">>,
  path: string,
) {
  try {
    const session = await auth();
    if (!session) return { message: "Unauthorized", success: false };
    const userId = session.user.id;
    await db.transaction(async (tx) => {
      const parentIds: Array<number> = [];
      for (const post of values) {
        const [{ id }] = await tx
          .insert(posts)
          .values({
            text: post.text,
            userId: session.user.id,
            parentId: parentIds.length ? parentIds[parentIds.length - 1] : null,
          })
          .returning();
        parentIds.push(id);
      }
    });
    revalidatePath(path);
    return { message: "Thread created successfully", success: true };
  } catch (error) {
    console.error(error);
    return { message: "Error creating thread", success: false };
  }
}

export async function createPost(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const formValues = decode(formData, {
      arrays: ["post"],
    });
    const postList = createPostSchema.parse(formValues);
    const parent = postList.posts.find((p) => p.isParent);
    if (!parent) return { message: "No parent found", success: false };
    const session = await auth();
    if (!session) return { message: "Unauthorized", success: false };
    await db.transaction(async (tx) => {
      const parentIds: Array<number> = [];
      for (const post of postList.posts) {
        const [{ id }] = await tx
          .insert(posts)
          .values({
            text: post.text,
            userId: session.user.id,
            parentId: parentIds.length ? parentIds[parentIds.length - 1] : null,
          })
          .returning();
        parentIds.push(id);
      }
    });
    revalidatePath("/");
    return { message: "Post created successfully", success: true };
  } catch (error) {
    console.error(error);
    return { message: "Error creating post", success: false };
  }
}

const updateSchema = z.object({
  userId: z.string(),
  username: z
    .string()
    .min(2)
    .max(20)
    .refine((u) => u !== "me"),
  bio: z.string().min(2).max(200),
  fullname: z
    .string()
    .min(2)
    .max(20)
    .refine((n) => n !== "me"),
});

export async function updateUserDetails(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const formValues = decode(formData);
    const { userId, fullname, username, bio } = updateSchema.parse(formValues);
    const valuesToInsert: typeof userDetails.$inferInsert = {
      fullName: fullname,
      username,
      bio,
      userId,
    };
    await db.insert(userDetails).values(valuesToInsert);
    revalidatePath("/onboarding");
    return { message: "User details updated successfully", success: true };
  } catch (error) {
    console.error(error);
    return { message: "Error updating user details", success: false };
  }
}

const likePostSchema = z.object({
  isLiked: z.coerce.boolean(),
  postId: z.number(),
  pathname: z.string(),
});

export async function likePost(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session) return { message: "Unauthorized", success: false };

  const formValues = decode(formData, {
    numbers: ["postId"],
    booleans: ["isLiked"],
  });
  const parse = likePostSchema.safeParse(formValues);
  if (!parse.success) return { message: "Invalid form data", success: false };
  const { isLiked, postId, pathname } = parse.data;
  const { success } = await unkey.limit(session.user.id + postId);
  if (!success)
    return { message: "You have exceeded your rate limit", success: false };
  try {
    const userId = session.user.id;
    if (isLiked) {
      console.log(`Unliking post ${postId}`);
      await db
        .delete(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
    } else {
      console.log(`Liking post ${postId}`);
      await db.insert(likes).values({
        postId,
        userId,
      });
    }
    revalidatePath(pathname);
  } catch (error) {
    console.error(error);
    return {
      message: `Error ${isLiked ? "unliking" : "liking"} post`,
      success: false,
    };
  }
}

const followOrUnfollowSchema = z.object({
  isFollowedByCurrentUser: z.coerce.boolean(),
  userToFollowId: z.string(),
});

export async function followOrUnfollow(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session) return { message: "Unauthorized", success: false };

  const formValues = decode(formData, {
    booleans: ["isFollowedByCurrentUser"],
  });
  console.log(formValues);
  const parse = followOrUnfollowSchema.safeParse(formValues);
  if (!parse.success) return { message: "Invalid form data", success: false };
  const { isFollowedByCurrentUser, userToFollowId } = parse.data;
  const { success } = await unkey.limit(session.user.id + userToFollowId);
  if (!success)
    return { message: "You have exceeded your rate limit", success: false };
  try {
    console.log({ isFollowedByCurrentUser, userToFollowId });
    if (isFollowedByCurrentUser) {
      console.log(`Unfollowing user ${userToFollowId}`);
      await db
        .delete(followers)
        .where(
          and(
            eq(followers.followerId, session.user.id),
            eq(followers.userId, userToFollowId),
          ),
        );
    } else {
      console.log(`Following user ${userToFollowId}`);
      await db.insert(followers).values({
        userId: userToFollowId,
        followerId: session.user.id,
      });
    }
    revalidatePath("/search");
  } catch (error) {
    console.error(error);
    return {
      message: `Error ${
        isFollowedByCurrentUser ? "unfollowing" : "following"
      } user`,
      success: false,
    };
  }
}
