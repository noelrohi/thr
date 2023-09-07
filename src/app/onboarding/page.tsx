import { auth, clerkClient, currentUser } from "@clerk/nextjs";
import { Screens } from "@/components/onboarding";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { faker } from "@faker-js/faker";
import { db } from "@/db";

export const revalidate = 0;

function generateName(firstName: string | null, lastName: string | null) {
  const firstname = firstName ?? faker.person.firstName;
  const lastname = lastName ?? faker.person.lastName;
  return `${firstname} ${lastname}`;
}

export default async function OnboardingLayout() {
  const authUser = await currentUser();

  if (!authUser) {
    redirect("/sign-up");
  }
  const getUser = await db
    .select({
      clerkId: users.clerkId,
      isOnboarded: users.onboarded,
      username: users.username,
      bio: users.bio,
      image: users.image,
    })
    .from(users)
    .where(eq(users.clerkId, authUser.id));

  if (getUser[0]?.isOnboarded) {
    redirect("/");
  }
  const clerkUser = await clerkClient.users.getUser(authUser.id);

  const userData = {
    id: clerkUser.id,
    username: getUser[0]?.username
      ? getUser[0]?.username
      : clerkUser.id.slice(5),
    name: generateName(clerkUser.firstName, clerkUser.lastName),
    bio: getUser[0]?.bio ? getUser[0]?.bio : "",
    image: getUser[0]?.image ? getUser[0]?.image : clerkUser.imageUrl,
  };
  const isTaken =
    (await db.select().from(users).where(eq(users.username, userData.username)))
      .length >= 1;
  return (
    <div className="px-3 pt-8">
      {authUser ? <Screens userData={userData} isTaken={isTaken} /> : null}
    </div>
  );
}
