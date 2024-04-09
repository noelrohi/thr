import { auth } from "@/auth";
import { Post } from "@/components/thread/server";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const post = await db.query.posts.findFirst({
    where: (table, { eq }) => eq(table.id, Number(params.id)),
    with: {
      replies: {
        with: {
          likes: true,
          replies: true,
          user: true,
        },
      },
      user: true,
      parent: {
        with: {
          replies: {
            with: {
              likes: true,
              replies: true,
              user: true,
            },
          },
          user: true,
        },
      },
      likes: true,
    },
  });
  if (!post) notFound();
  const session = await auth();
  if (!session) throw new Error("User not found");
  const likedPost = await db.query.likes.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.postId, post.id), eq(table.userId, session.user.id)),
  });

  const parentPost = post.parent;
  const moreReplies = post.parent?.replies.filter((r) => r.id !== post.id);

  return (
    <div className="space-y-2" key={Math.random()}>
      <Post
        post={post}
        type="expand"
        isLiked={!!likedPost}
        avatarProps={{
          src: post.user?.image ?? "",
          alt: post.user?.username || "@anonymous",
          fallback: post.user?.username || "G",
        }}
      />
      {post.replies.length > 0 && <Separator />}
      {post.replies.map((reply) => (
        <Post
          key={reply.id}
          post={reply}
          isLiked={false}
          avatarProps={{
            src: reply.user?.image ?? "",
            alt: reply.user?.username || "@anonymous",
            fallback: reply.user?.username || "G",
          }}
        />
      ))}
      {parentPost && moreReplies && moreReplies.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col">
            <div className="font-bold">
              More replies to {parentPost.user?.username}
            </div>
            {moreReplies
              .filter((r) => r.id !== post.id)
              .map((reply) => (
                <Post
                  key={reply.id}
                  post={reply}
                  isLiked={false}
                  avatarProps={{
                    src: reply.user?.image ?? "",
                    alt: reply.user?.username || "@anonymous",
                    fallback: reply.user?.username || "G",
                  }}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
}
