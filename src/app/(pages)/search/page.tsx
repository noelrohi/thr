import { InputWithKeyUp } from "@/app/(pages)/search/search-input";
import { auth } from "@/auth";
import { Form, SubmitButton } from "@/components/interactive";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";
import { db } from "@/db";
import { Loader2, SearchIcon } from "lucide-react";
import { Fragment, Suspense } from "react";
import { z } from "zod";

const spSchema = z.object({
  q: z.string().optional(),
});

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default function Search({ searchParams }: PageProps) {
  const { q } = spSchema.parse(searchParams);
  return (
    <div className="h-full space-y-2 py-4">
      <div className="relative">
        <InputWithKeyUp
          type="text"
          placeholder="Search..."
          className="px-8"
          defaultValue={q}
          name="q"
        />
        <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-2 size-5 text-muted-foreground" />
      </div>
      <Suspense
        key={JSON.stringify(searchParams)}
        fallback={
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-6 animate-spin" />
          </div>
        }
      >
        <UserList q={q} />
      </Suspense>
    </div>
  );
}

async function UserList({ q }: typeof spSchema._output) {
  const session = await auth();
  if (!session) throw new Error("User not found");
  const userList = await db.query.users.findMany({
    where: (table, { ilike }) => (q ? ilike(table.name, `%${q}%`) : undefined),
    limit: 100,
    with: {
      followers: true,
    },
  });
  if (!userList.length)
    return (
      <div className="flex h-full items-center justify-center">No results</div>
    );
  return (
    <div className="space-y-4 py-4">
      {userList.map((user) => {
        const isFollowedByCurrentUser = user.followers.some(
          (f) => f.followerId === session.user.id,
        );
        return (
          <Fragment key={user.id}>
            <div className="flex justify-between">
              <div className="flex gap-4">
                <UserAvatar
                  className="size-8"
                  src={user.image ?? ""}
                  alt={user.username}
                />
                <div>
                  <div>{user.username}</div>
                  <div className="text-muted-foreground">{user.name}</div>
                  <div>{user.followers.length} followers</div>
                </div>
              </div>
              {user.id !== session.user.id && (
                <div className="flex items-center">
                  <Form actionString="followOrUnfollow">
                    <input
                      type="hidden"
                      name="isFollowedByCurrentUser"
                      value={String(isFollowedByCurrentUser)}
                    />
                    <input
                      type="hidden"
                      name="userToFollowId"
                      value={user.id}
                    />
                    <SubmitButton size="sm" variant="outline">
                      {isFollowedByCurrentUser ? "Unfollow" : "Follow"}
                    </SubmitButton>
                  </Form>
                </div>
              )}
            </div>
            <Separator />
          </Fragment>
        );
      })}
    </div>
  );
}
