import { db } from "@/db";
import { Suspense } from "react";

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
  const posts = await db.query.posts.findMany();
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
