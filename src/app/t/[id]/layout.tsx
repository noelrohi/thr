import Nav from "@/components/nav";
import BackButton from "@/components/thread/backButton";
import { db } from "@/db";
import { users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function ThreadPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const getUser = await db.query.users.findFirst({
    where: eq(users.clerkId, user.id),
  });

  if (!getUser?.onboarded) {
    redirect("/onboarding");
  }

  return (
    <>
      <Nav
        create={{
          id: getUser.clerkId,
          name: getUser.name,
          image: getUser.image,
        }}
        username={getUser.username}
      />
      <div className="px-3 relative mt-8 mb-6">
        <BackButton />
        <div className="text-2xl font-semibold absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          Thread
        </div>
      </div>

      {children}
    </>
  );
}
