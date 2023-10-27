import Item from "@/components/thread";
import MainItem from "@/components/thread/main";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { threads } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  const posts = await db.query.threads.findMany();

  return posts.map((post) => ({
    id: String(post.id),
  }));
}

export default async function ThreadPage({
  params,
}: {
  params: { id: number };
}) {
  const { id } = params;

  const post = await db.query.threads.findFirst({
    with: {
      likes: true,
      author: true,
      parent: {
        with: {
          parent: {
            with: {
              author: true,
            },
          },
          likes: true,
          author: true,
          replies: {
            with: {
              author: true,
            },
          },
        },
      },
      replies: {
        with: {
          author: true,
          likes: true,
          replies: {
            with: {
              author: true,
            },
          },
        },
      },
    },
    where: and(eq(threads.id, id)),
  });

  if (!post) {
    return <div className="text-center text-neutral-600">Post not found.</div>;
  }

  return (
    <>
      {post.parent && post.parent.parent ? (
        <Link href={"/t/" + post.parent.parentId}>
          <Button
            size="sm"
            variant="ghost"
            className="flex pl-2 text-neutral-600"
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            <div className="overflow-hidden rounded-full h-4 w-4 mr-2 bg-neutral-600">
              <Image
                src={post.parent.parent.author.image}
                alt={post.parent.parent.author.name + "'s avatar"}
                width={16}
                height={16}
              />
            </div>
            See earlier reply
          </Button>
        </Link>
      ) : null}
      {post.parent ? (
        <Item key={post.parent.id} parent data={post.parent} />
      ) : null}
      <MainItem key={post.id} data={post} />
      {post.replies.map((child) => (
        <Item key={child.id} data={child} />
      ))}
    </>
  );
}
