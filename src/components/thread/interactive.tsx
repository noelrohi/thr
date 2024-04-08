"use client";

import { useControl } from "@/hooks/use-control";
import { absoluteUrl } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

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

interface CopyItemProps extends React.ComponentPropsWithoutRef<"button"> {
  postId: number;
}

export function CopyItem({
  children,
  onClick,
  postId,
  ...props
}: CopyItemProps) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(absoluteUrl(`/post/${postId}`));
        toast.success("Link copied to clipboard");
      }}
      {...props}
    >
      {children}
    </button>
  );
}
