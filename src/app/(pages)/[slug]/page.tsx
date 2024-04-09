import { auth, signOut } from "@/auth";
import { Form, SubmitButton } from "@/components/interactive";
import { Post } from "@/components/thread/server";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";
import { db } from "@/db";
import { Edit, LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { Fragment } from "react";

type PageProps = {
  params: {
    slug: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  let slug = params.slug;
  const session = await auth();
  if (!session) throw new Error("User not found");
  if (params.slug === "%40me") {
    slug = session.user.username;
  }
  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.username, slug),
    with: {
      followers: true,
      posts: {
        with: {
          likes: true,
          replies: true,
          user: true,
        },
      },
    },
  });
  if (!user) throw new Error("User not found");
  const followedByCurrentUser = user.followers.some(
    (f) => f.followerId === session.user.id,
  );
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between py-4">
        <div>
          <div>
            <h1 className="font-bold text-2xl">{user.name}</h1>
            <div>{user.username}</div>
          </div>
        </div>
        <div>
          <UserAvatar
            className="size-16"
            src={user.image ?? ""}
            alt={user.username}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          {user.followers.length} followers
        </div>
        <form>
          <button
            title="Sign out"
            formAction={async () => {
              "use server";
              await signOut();
            }}
          >
            <LogOut />
          </button>
        </form>
      </div>
      {session.user.id === user.id ? (
        <Button type="button" className="w-full" variant="outline">
          Edit Profile
        </Button>
      ) : (
        <Form actionString="followOrUnfollow" className="w-full">
          <input
            type="hidden"
            name="isFollowedByCurrentUser"
            value={String(followedByCurrentUser)}
          />
          <input type="hidden" name="userToFollowId" value={user.id} />
          <SubmitButton type="submit" className="w-full" variant="outline">
            {followedByCurrentUser ? "Unfollow" : "Follow"}
          </SubmitButton>
        </Form>
      )}
      <div className="flex w-full *:w-1/3 *:py-2">
        <button className="border-foreground border-b font-semibold text-base">
          Threads
        </button>
        <button className="cursor-not-allowed border-muted border-b text-base text-muted-foreground">
          Replies
        </button>
        <button className="cursor-not-allowed border-muted border-b text-base text-muted-foreground">
          Reposts
        </button>
      </div>
      {user.posts.map((post) => (
        <Fragment key={post.id}>
          <Post
            post={post}
            avatarProps={{
              src: post.user?.image ?? "",
              alt: post.user?.username || "@anonymous",
            }}
          />
          <Separator />
        </Fragment>
      ))}
    </section>
  );
}
