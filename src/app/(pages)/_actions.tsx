"use server";

import { db } from "@/db";
import { posts, userDetails } from "@/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { decode } from "decode-formdata";
import { eq } from "drizzle-orm";

type State =
  | {
      message: string | undefined;
      success: boolean | undefined;
    }
  | undefined;

export async function createPost(
  prevState: State,
  formData: FormData,
): Promise<State> {
  try {
    const title = formData.get("title") as string;
    await db.insert(posts).values({ title });
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
