import Nav from "@/components/nav";
import { Bar } from "@/components/search/bar";
import { SearchUser } from "@/components/search/user";
import { db } from "@/db";
import { followers, users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { and, eq, like, ne, or } from "drizzle-orm";
import { redirect } from "next/navigation";

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

  const data = await db.query.users.findMany({
    with: {
      followers: true,
    },
    where: searchParams?.q
      ? and(
          ne(users.clerkId, current_user.id),
          or(
            like(users.username, `%${searchParams.q as string}%`),
            like(users.name, `%${searchParams.q as string}%`)
          )
        )
      : ne(users.clerkId, current_user.id),
  });
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
          {data.map((user) => (
            <SearchUser
              isFollowing={user.followers.some(
                (f) => f.followerId === current_user.id
              )}
              followersCount={user.followers.length}
              key={user.id}
              authenticatedId={current_user.id}
              user={user}
            />
          ))}
        </>
      )}
    </>
  );
}
