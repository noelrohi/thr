"use client";

import { useTransition } from "react";
import { Button } from "../ui/button";
import { followUser, unfollowUser } from "@/lib/actions/userActions";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function FollowButton({
  isFollowing,
  name,
  id,
  followingId,
}: {
  isFollowing: boolean;
  name: string;
  id: string;
  followingId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        toast(isFollowing ? "Unfollowed " + name : "Followed " + name);
        startTransition(() => {
          if (isFollowing) {
            unfollowUser(id, followingId, pathname);
          } else {
            followUser(id, followingId, pathname);
          }
        });
      }}
      className="w-full"
      variant="outline"
    >
      {isPending ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : isFollowing ? (
        "Following"
      ) : (
        "Follow"
      )}
    </Button>
  );
}
