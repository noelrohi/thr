import { currentUser } from "@/auth";
import { ReplyForm } from "@/components/interactive";
import { LikeControl } from "@/components/like-control";
import { ThreadActionsProvider } from "@/components/providers/control";
import { DialogProvider } from "@/components/providers/dialog";
import { CopyItem, LikesAndReplies } from "@/components/thread/interactive";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { toRelativeTime } from "@/lib/utils";
import type { PostWithLikesAndReplies } from "@/types";
import { Info, MessageCircle, Repeat, Send } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export function Post({
  post,
  avatarProps,
  isLiked,
  type = "list",
}: {
  post: PostWithLikesAndReplies;
  avatarProps: React.ComponentPropsWithoutRef<typeof UserAvatar>;
  isLiked?: boolean;
  type?: "list" | "expand";
}) {
  return (
    <>
      <div className="flex gap-2 py-2">
        {type === "list" && (
          <div>
            <UserAvatar className="size-8" {...avatarProps} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          {post.parent?.user?.details?.username && (
            <div className="flex items-center gap-1 text-sm">
              <Info className="size-4" /> A reply to{" "}
              {post.parent.user.details.username}'s{" "}
              <Link href={`/post/${post.parent.id}`} className="font-semibold">
                Thread
              </Link>
            </div>
          )}
          <div className="flex gap-2">
            {type !== "list" && (
              <UserAvatar className="size-8" {...avatarProps} />
            )}
            <div className="font-semibold">{post.user.details?.username}</div>
            <span className="text-muted-foreground">
              {toRelativeTime(post.createdAt)}
            </span>
          </div>
          <Link href={`/post/${post.id}`}>{post.text}</Link>
          <ThreadActionsProvider
            likes={post.likes.length}
            replies={post.replies.length}
          >
            <div className="flex gap-4">
              <LikeControl isLiked={isLiked || false} postId={post.id} />
              <Suspense fallback={<MessageCircle className="size-5" />}>
                <ReplyToThread post={post} />
              </Suspense>
              <Repeat className="size-5" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Send className="size-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <CopyItem postId={post.id} className="w-full text-sm">
                      Copy link
                    </CopyItem>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

async function ReplyToThread({ post }: { post: PostWithLikesAndReplies }) {
  const user = await currentUser();
  if (!user) throw new Error("User not logged in");
  return (
    <DialogProvider>
      <DialogTrigger asChild>
        <MessageCircle className="size-5" />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-auto">
        <ReplyForm user={user} post={post} />
      </DialogContent>
    </DialogProvider>
  );
}
