import { Input } from "@/components/ui/input";
import { Loader2, SearchIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { InputWithKeyUp } from "./search-input";
import { Fragment, Suspense } from "react";
import { z } from "zod";
import { db } from "@/db";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

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
  const userList = await db.query.userDetails.findMany({
    where: (table, { ilike }) =>
      q ? ilike(table.fullName, `%${q}%`) : undefined,
    limit: 100,
    with: {
      user: {
        with: {
          followers: true,
        },
      },
    },
  });
  const session = await auth();
  if (!session) throw new Error("User not found");
  if (!userList.length)
    return (
      <div className="flex h-full items-center justify-center">No results</div>
    );
  return (
    <div className="space-y-4 py-4">
      {userList.map((user) => (
        <Fragment key={user.id}>
          <div className="flex justify-between">
            <div className="flex gap-4">
              <UserAvatar
                className="size-8"
                src={user.user.image ?? ""}
                alt={user.username}
              />
              <div>
                <div>{user.username}</div>
                <div className="text-muted-foreground">{user.fullName}</div>
                <div>{user.user.followers.length} followers</div>
              </div>
            </div>
            {user.userId !== session.user.id && (
              <div className="flex items-center">
                <form>
                  <Button size="sm">Follow</Button>
                </form>
              </div>
            )}
          </div>
          <Separator />
        </Fragment>
      ))}
    </div>
  );
}
