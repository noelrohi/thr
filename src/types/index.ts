import type { Session, auth } from "@/auth";
import type { users } from "@/db/schema/auth";
import type { likes, posts } from "@/db/schema/main";
import type { InferSelectModel } from "drizzle-orm";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type UserWithDetails = Session["user"];

export interface PostDetails extends InferSelectModel<typeof posts> {
  user: InferSelectModel<typeof users> | null;
  likes: Array<InferSelectModel<typeof likes>>;
  replies: Array<InferSelectModel<typeof posts>>;
}

export interface PostWithLikesAndReplies
  extends InferSelectModel<typeof posts> {
  likes: Array<InferSelectModel<typeof likes>>;
  replies: Array<InferSelectModel<typeof posts>>;
  user: InferSelectModel<typeof users>;
  parent?:
    | (InferSelectModel<typeof posts> & {
        user: InferSelectModel<typeof users>;
      })
    | null;
}
