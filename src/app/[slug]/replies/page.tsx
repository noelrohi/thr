import Item from "@/components/thread";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { threads, users } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Tabs from "../tabs";

export default async function RepliesPage({
  params,
}: {
  params: { slug: string };
}) {
  const getUser = await db.query.users.findFirst({
    where: eq(users.username, params.slug),
  });
  if (!getUser) return null;

  const posts = await db.query.threads.findMany({
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
        },
      },
    },
    orderBy: [desc(threads.createdAt)],
    where: and(
      eq(threads.authorId, getUser.clerkId),
      sql`${threads.parentId} IS NOT NULL`
    ),
  });

  return (
    <>
      <div className="w-full mt-4 flex">
        <Link
          href={`/${params.slug}`}
          className="w-full h-10 py-2 font-medium border-b border-neutral-900 duration-200 hover:border-neutral-700 hover:text-muted-foreground text-center text-muted-foreground"
        >
          Threads
        </Link>
        <button className="w-full h-10 py-2 font-semibold border-b border-b-white text-center">
          Replies
        </button>
      </div>
      {posts.length === 0 ? (
        <div className="text-neutral-600 mt-4 text-center leading-loose">
          No replies posted yet.
        </div>
      ) : (
        posts.map((post) => (
          <>
            {post.parent && post.parent.parent && (
              <Link
                href={"/t/" + post.parent.parentId}
                key={post.parent.parentId}
              >
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
            )}
            {post.parent && (
              <Item key={post.parent.id} parent data={post.parent} />
            )}
            <Item data={post} key={post.id} />
          </>
        ))
      )}
    </>
  );
}
