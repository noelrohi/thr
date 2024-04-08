import { auth, signIn } from "@/auth";
import { ThreadIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session) redirect("/");
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-y-4">
      <ThreadIcon className="mx-auto size-12" />
      <h1 className="font-bold text-4xl">Threads</h1>
      <SignInDialog />
    </main>
  );
}

function SignInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full max-w-xl">
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-auto">
        <DialogTitle>Welcome to Threads!</DialogTitle>
        <DialogDescription>Sign in to continue.</DialogDescription>
        <form>
          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              variant="secondary"
              formAction={async () => {
                "use server";
                await signIn("google");
              }}
            >
              Sign In with Google
            </Button>
            <Button
              type="submit"
              variant="secondary"
              formAction={async () => {
                "use server";
                await signIn("discord");
              }}
            >
              Sign In with Discord
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
