"use client";

import { useControl } from "@/hooks/control-provider";
import Link from "next/link";

export function LikesAndReplies({ postId }: { postId: number }) {
  const { likes, replies } = useControl();
  return (
    <>
      <Link className="inline-flex" href={`/post/${postId}`}>
        {replies} repl{replies > 1 ? "ies" : "y"}
      </Link>{" "}
      · {likes} like
      {likes > 1 ? "s" : null}
    </>
  );
}
