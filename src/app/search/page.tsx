import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Nav from "@/components/nav";
import { Bar } from "@/components/search/bar";
import { SearchUser } from "@/components/search/user";
import { db } from "@/db";
import { and, eq, like, ne, or, sql } from "drizzle-orm";
import { followers, users } from "@/db/schema";
import { SquareDashedBottom } from "lucide-react";

export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const current_user = await currentUser();
  if (!current_user) throw new Error("No user");

  const getSelf = await db.query.users.findFirst({
    where: eq(users.clerkId, current_user.id),
  });

  if (!getSelf) redirect("/onboarding");

  const data = await db
    .select({ user: users })
    .from(users)
    .where(
      searchParams?.q
        ? and(
            ne(users.clerkId, current_user.id),
            or(
              like(users.username, `%${searchParams.q as string}%`),
              like(users.name, `%${searchParams.q as string}%`)
            )
          )
        : ne(users.clerkId, current_user.id)
    );
  // return (
  //   <>
  //     <div className="px-3 mb-1">
  //       <div className="text-2xl font-semibold pt-8 pb-5">Search</div>
  //       <Bar />
  //     </div>
  //     {JSON.stringify(data.length)}
  //   </>
  // );

  return (
    <>
      <Nav
        create={{
          id: getSelf?.clerkId,
          name: getSelf.name,
          image: getSelf.image,
        }}
        username={getSelf.username}
      />
      <div className="px-3 mb-1">
        <div className="text-2xl font-semibold pt-8 pb-5">Search</div>
        <Bar />
      </div>
      {data.length === 0 ? (
        <div className="text-neutral-600 mt-4 text-center leading-loose">
          No results
        </div>
      ) : (
        <>
          {await Promise.all(
            data.map(async ({ user }) => {
              const isFollowing = await db.query.followers.findFirst({
                where: and(
                  eq(followers.followerId, current_user.id),
                  eq(followers.userId, user.clerkId)
                ),
              });
              const userFollowers = await db.query.followers.findMany({
                where: eq(followers.userId, user.clerkId),
              });
              return (
                <SearchUser
                  isFollowing={!!isFollowing}
                  followersCount={userFollowers.length}
                  key={user.id}
                  authenticatedId={current_user.id}
                  user={user}
                />
              );
            })
          )}
        </>
      )}
    </>
  );
}
