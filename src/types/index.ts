import type { currentUser } from "@/auth";
import type { users } from "@/db/schema/auth";
import type { likes, posts, userDetails } from "@/db/schema/main";
import type { InferSelectModel } from "drizzle-orm";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  links: {
    twitter: string;
    github: string;
  };
  mainNav: {
    title: string;
    href: string;
  }[];
};

export type UserWithDetails = NonNullable<
  Awaited<ReturnType<typeof currentUser>>
>;

interface User extends InferSelectModel<typeof users> {
  details: InferSelectModel<typeof userDetails> | null;
}
export interface PostDetails extends InferSelectModel<typeof posts> {
  user: User | null;
  likes: Array<InferSelectModel<typeof likes>>;
  replies: Array<InferSelectModel<typeof posts>>;
}

export interface PostWithLikesAndReplies
  extends InferSelectModel<typeof posts> {
  likes: Array<InferSelectModel<typeof likes>>;
  replies: Array<InferSelectModel<typeof posts>>;
  user: InferSelectModel<typeof users> & {
    details: InferSelectModel<typeof userDetails> | null;
  };
  parent?:
    | (InferSelectModel<typeof posts> & {
        user: InferSelectModel<typeof users> & {
          details: InferSelectModel<typeof userDetails> | null;
        };
      })
    | null;
}
