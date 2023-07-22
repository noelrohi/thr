import { currentUser } from "@clerk/nextjs";
import Item from "@/components/thread";
import Link from "next/link";
import { db } from "@/db";
import { and, eq, sql } from "drizzle-orm";
import { likes, threads } from "@/db/schema";
import { alias } from "drizzle-orm/mysql-core";

export default async function ProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await currentUser();

  if (!user) return null;

  const posts = await db.query.threads.findMany({
    with: {
      likes: true,
      author: true,
      replies: {
        with: {
          author: true,
        },
      },
    },
    where: eq(threads.authorId, user.id),
  });

  return (
    <>
      <div className="w-full mt-4 flex">
        <button className="w-full h-10 py-2 font-semibold border-b border-b-white text-center">
          Threads
        </button>
        <Link
          href={`/${params.slug}/replies`}
          className="w-full h-10 py-2 font-medium border-b border-neutral-900 duration-200 hover:border-neutral-700 hover:text-neutral-500 text-center text-neutral-600"
        >
          Replies
        </Link>
      </div>
      {posts.length === 0 ? (
        <div className="text-neutral-600 mt-4 text-center leading-loose">
          No threads posted yet.
        </div>
      ) : (
        posts.map((post) => <Item data={post} key={post.id} />)
      )}
    </>
  );
}
