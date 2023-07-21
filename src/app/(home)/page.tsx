import Image from "next/image";
import Link from "next/link";

import SignInButton from "@/components/auth/buttons";
import { currentUser } from "@clerk/nextjs";
import { db } from "@/db";
import { threads, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { get } from "http";
import Nav from "@/components/nav";

export const revalidate = 0;

export default async function Page() {
  const user = await currentUser();

  if (!user)
    return (
      <>
        <div className="h-16 w-16 bg-cover">
          <Image
            src={"/assets/threads.svg"}
            alt="Threads logo"
            width={64}
            height={64}
            className="min-h-full invert min-w-full object-cover"
          />
        </div>
        <div className="gradient mt-4 mb-12 text-4xl font-bold">Threads</div>

        <Link href="/sign-up" className="w-full px-6"></Link>
        <SignInButton className="w-full px-6 mt-2">Sign In</SignInButton>
      </>
    );

  const getUser = await db
    .select({
      clerkId: users.clerkId,
      isOnboarded: users.onboarded,
      name: users.name,
      image: users.image,
      username: users.username,
    })
    .from(users)
    .where(eq(users.clerkId, user.id));

  if (!getUser[0]?.isOnboarded) {
    redirect("/onboarding");
  }
  // const posts = await prisma.post.findMany({
  //   take: 20,
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   include: {
  //     author: true,
  //     children: {
  //       include: {
  //         author: true,
  //       },
  //     },
  //     parent: true,
  //     likes: true,
  //   },
  //   where: {
  //     parent: null,
  //   },
  // });

  const posts = await db
    .select()
    .from(threads)
    .where(sql`${threads.parentId} IS NULL`);

  return (
    <>
      <Nav
        create={{
          id: getUser[0].clerkId,
          name: getUser[0].name!,
          image: getUser[0].image!,
        }}
        username={getUser[0].username!}
      />
      <div className="flex items-center justify-center w-full py-5">
        <div className="h-9 w-9 bg-cover">
          <Image
            src={"/assets/threads.svg"}
            width={64}
            height={64}
            alt="Threads logo"
            className="min-h-full invert min-w-full object-cover"
          />
        </div>
      </div>

      <div className="whitespace-pre text-xs">
        {posts.length ? JSON.stringify(posts, null, 2) : "Empty"}
      </div>
      {/* <HomePosts posts={posts} /> */}
    </>
    // </div>
    // </main>
  );
}
