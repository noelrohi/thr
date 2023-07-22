"use client";

import { ExtendedThread } from "@/types";
import { Modal } from "../comment";
import Like from "./like";
import Repost from "./repost";
import Share from "./share";

export default function Controls({
  data,
  numPosts,
}: {
  data: ExtendedThread;
  numPosts?: number;
}) {
  const likes = data.likes.map((like) => like.userId);

  return (
    <div className="relative h-9">
      <div className="flex items-center absolute top-0 left-0 space-x-3.5 py-2 z-10">
        <Like likes={likes} numPosts={numPosts} post={data.id} />
        <Modal data={data} />
        <Repost />
        <Share name={data.author?.name} post={data.id} />
      </div>
    </div>
  );
}
