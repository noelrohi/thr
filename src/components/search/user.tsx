import { Users } from "@/db/schema";
import { nFormatter } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "./follow";
import UserAvatar from "../profile/avatar";

export function SearchUser({
  user,
  isFollowing,
  authenticatedId,
  followersCount,
}: {
  user: Users;
  isFollowing: boolean;
  authenticatedId: string;
  followersCount: number;
}) {
  return (
    <Link href={`/${user.username}`} className="pl-3 pt-4 flex font-light">
      <UserAvatar src={user.image} name={user.name} className="mt-1 mr-2" />
      <div className="grow flex items-start justify-between pb-4 pr-3 border-b border-neutral-900">
        <div>
          <div className="font-semibold">{user.username}</div>
          <div className="text-neutral-600 -mt-1 font-medium">{user.name}</div>
          <div className="mt-2 text-sm">
            {nFormatter(followersCount, 1)}{" "}
            {followersCount === 1 ? "follower" : "followers"}
          </div>
        </div>
        <FollowButton
          isFollowing={isFollowing}
          followerId={authenticatedId}
          followingId={user.clerkId}
          name={user.name}
        />
      </div>
    </Link>
  );
}
