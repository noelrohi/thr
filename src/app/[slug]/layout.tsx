import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import Nav from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Instagram } from "lucide-react";

import UserAvatar from "@/components/profile/avatar";
import { EditModal } from "@/components/profile/edit";
import FollowButton from "@/components/profile/follow";
import { InfoModal } from "@/components/profile/info";
import SelfShare from "@/components/profile/selfShare";
import SignOut from "@/components/profile/signOut";
import { db } from "@/db";
import { followers, users } from "@/db/schema";
import { nFormatter } from "@/lib/utils";
import { eq } from "drizzle-orm";
import ErrorWithNav from "@/components/error-with-nav";

export default async function ProfilePageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const user = await currentUser();

  if (!user) return null;

  const getSelf = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });

  if (!getSelf) redirect("/onboarding");

  const getUser = await db.query.users.findFirst({
    where: eq(users.username, params.slug),
  });

  if (!getUser) return <ErrorWithNav />;

  const userFollowers = await db.query.followers.findMany({
    where: eq(followers.userId, getUser.clerkId),
  });

  const self = getSelf.username === params.slug;

  const isFollowing = self
    ? false
    : userFollowers.some((follow) => follow.followerId === getSelf.clerkId);

  return (
    <>
      <Nav
        create={{
          id: getSelf.clerkId,
          name: getSelf.name ?? "",
          image: getSelf.image ?? "",
        }}
        username={getSelf.username}
      />
      <div className="px-3 relative flex w-full items-center justify-end mt-8 mb-6">
        {/* <Globe className="w-5 h-5" /> */}
        <div className="flex items-center space-x-3">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            <Instagram className="w-5 h-5" />
          </a>
          <InfoModal />
          <SignOut />
        </div>
      </div>
      <div className="px-3 flex w-full justify-between items-start">
        <div className="grow">
          <div className="text-2xl font-semibold">{getUser?.name}</div>
          <div className="flex items-center mt-1">
            {getUser.username}
            <Badge variant="secondary" className="text-xs ml-2">
              threads.net
            </Badge>
          </div>
          {getUser.bio ? (
            <div className="pt-4 leading-relaxed">{getUser.bio}</div>
          ) : null}
          <div className="py-4 text-muted-foreground">
            {nFormatter(userFollowers.length, 1)}{" "}
            {userFollowers.length === 1 ? "follower" : "followers"}
          </div>
        </div>

        <UserAvatar
          src={getUser.image}
          name={getUser.name}
          className="w-14 h-14"
        />
      </div>

      {self ? (
        <div className="w-full space-x-2 flex px-3">
          <EditModal data={getUser} />
          <SelfShare name={getUser.name} username={getUser.username} />
        </div>
      ) : (
        <div className="w-full px-3">
          <FollowButton
            id={getSelf.clerkId}
            followingId={getUser.clerkId}
            name={getUser.name}
            isFollowing={isFollowing}
          />
        </div>
      )}

      {children}
    </>
  );
}
