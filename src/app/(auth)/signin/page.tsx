import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

async function signInAction(
  provider: "google" | "discord",
  formData: FormData,
) {
  "use server";
  await signIn(provider);
}

export default async function Page() {
  const session = await auth();
  if (session) redirect("/");
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="font-bold text-4xl">Sign In</h1>
      <p className="text-lg">Please sign in to continue.</p>
      <form>
        <Button type="submit" formAction={signInAction.bind(null, "google")}>
          Sign In with Google
        </Button>
        <Button type="submit" formAction={signInAction.bind(null, "discord")}>
          Sign In with Discord
        </Button>
      </form>
    </main>
  );
}
