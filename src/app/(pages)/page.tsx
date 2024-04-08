import { currentUser } from "@/auth";
import { Post } from "@/components/thread/server";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { Fragment, Suspense } from "react";

export default function Home() {
  return (
    <main>
      <Suspense fallback="Loading...">
        <Posts />
      </Suspense>
    </main>
  );
}

async function Posts() {
  const user = await currentUser();
  if (!user) throw new Error("User not found");
  const likedPosts = await db.query.likes
    .findMany({
      where: (table, { eq }) => eq(table.userId, user.id),
    })
    .then((p) => p.map((p) => p.postId));

  const posts = await db.query.posts.findMany({
    where: (table, { isNull }) => isNull(table.parentId),
    orderBy: (table, { desc }) => desc(table.createdAt),
    with: {
      likes: true,
      replies: true,
      user: {
        with: {
          details: true,
        },
      },
    },
  });
  return (
    <div className="space-y-2">
      {[...posts, ...posts, ...posts].map((post) => (
        <Fragment key={post.id}>
          <Post
            post={post}
            isLiked={likedPosts.some((p) => p === post.id)}
            currentUser={user}
          />
          <Separator />
        </Fragment>
      ))}
    </div>
  );
}
