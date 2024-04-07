import { auth, currentUser } from "@/auth";
import { ThreadIcon } from "@/components/icons";
import { Edit, Heart, Home, Loader2, Search, User2 } from "lucide-react";
import { redirect } from "next/navigation";
import {
  ActiveLink,
  AddRelatedThread,
  CreateThreadInput,
  Form,
  SubmitButton,
  ThreadFormInputs,
} from "./_interactive";
import { db } from "@/db";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Suspense } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";

interface StickyLayoutProps {
  children: React.ReactNode;
}

export default async function StickyLayout({ children }: StickyLayoutProps) {
  const session = await auth();
  if (!session) redirect("/signin");
  const userDetails = await db.query.userDetails.findFirst({
    where: (table, { eq }) => eq(table.userId, session.user.id),
  });
  if (userDetails?.username == null) redirect("/onboarding");
  return (
    <div className="relative mx-auto flex h-screen max-w-[500px] flex-col py-4">
      <ThreadIcon className="mx-auto size-9" />
      <main className="flex-1 overflow-auto px-2">{children}</main>
      <nav className="flex justify-around gap-2">
        <ActiveLink href="/">
          <Home className="size-6" />
        </ActiveLink>
        <ActiveLink href="/search">
          <Search className="size-6" />
        </ActiveLink>
        <Suspense fallback={<Edit className="size-6 opacity-75" />}>
          <CreateThread />
        </Suspense>
        <ActiveLink href={"#"}>
          <Heart className="size-6" />
        </ActiveLink>
        <ActiveLink href="/@me">
          <User2 className="size-6" />
        </ActiveLink>
      </nav>
    </div>
  );
}

async function CreateThread() {
  const user = await currentUser();
  if (!user) throw new Error("User not found");
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Edit className="size-6 opacity-75" />
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-auto">
          <ThreadFormInputs user={user} />
        </DialogContent>
      </Dialog>
    </>
  );
}
