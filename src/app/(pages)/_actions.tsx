"use server";

import { db } from "@/db";
import { posts, userDetails } from "@/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { decode } from "decode-formdata";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

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
    await db.insert(posts).values(values.map((v) => ({ ...v, userId })));
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
