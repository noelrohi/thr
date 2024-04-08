import { LikeControl } from "@/components/like-control";
import { ThreadActionsProvider } from "@/components/providers/control";
import { LikesAndReplies } from "@/components/thread/interactive";
import { UserAvatar } from "@/components/user-avatar";
import type { PostDetails, UserWithDetails } from "@/types";
import { MessageCircle, Repeat, Send } from "lucide-react";
import Link from "next/link";

export function Post({
  post,
  children,
  isLiked,
  currentUser,
}: {
  post: PostDetails;
  children?: React.ReactNode;
  isLiked?: boolean;
  currentUser: UserWithDetails;
}) {
  return (
    <>
      <div className="flex gap-2">
        <div>
          <UserAvatar
            className="size-8"
            src={post.user?.image ?? ""}
            alt={post.user?.details?.username || "@anonymous"}
            fallback={post.user?.details?.username || "G"}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div>gneiru</div>
            <span className="text-muted-foreground">14h</span>
          </div>
          <Link href={`/post/${post.id}`}>{post.text}</Link>
          <ThreadActionsProvider
            likes={post.likes.length}
            replies={post.replies.length}
          >
            <div className="flex gap-2">
              <LikeControl isLiked={isLiked || false} postId={post.id} />
              <MessageCircle className="size-5" />
              <Repeat className="size-5" />
              <Send className="size-5" />
            </div>
            <div className="text-muted-foreground text-sm">
              <LikesAndReplies postId={post.id} />
            </div>
          </ThreadActionsProvider>
        </div>
      </div>
    </>
  );
}
