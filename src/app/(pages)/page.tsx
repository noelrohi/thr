import { Input } from "@/components/ui/input";
import { db } from "@/db";
import { Suspense } from "react";
import { Form, SubmitButton } from "./_interactive";

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

async function LatestPost() {
  const latestPost = await db.query.posts.findFirst({
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });
  if (!latestPost) return null;
  return (
    <div>
      <strong>Latest Post: </strong>
      {latestPost.title}
    </div>
  );
}

function CreateForm() {
  return (
    <Form actionString="createPost" className="flex gap-2">
      <Input
        type="text"
        placeholder="Title"
        name="title"
        className="max-w-xs"
      />
      <SubmitButton>Create</SubmitButton>
    </Form>
  );
}
