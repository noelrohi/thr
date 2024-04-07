"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";

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
