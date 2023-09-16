"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Heart, Home, Search, User2 } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { createThread } from "@/lib/actions/threadActions";
import UserAvatar from "./profile/avatar";

export default function Nav({
  username,
  create,
}: {
  username: string | null;
  create: {
    id: string;
    name: string;
    image: string;
  };
}) {
  const path = usePathname();

  return (
    <div className="w-full max-w-[500px] bg-background z-50 fixed bottom-0 flex items-center justify-around p-3 pb-4">
      <Link href="/">
        <Home
          className={`w-6 h-6 ${path === "/" ? "" : "text-muted-foreground"}`}
        />
      </Link>
      <Link href="/search">
        <Search
          className={`w-6 h-6 ${
            path === "/search" ? "" : "text-muted-foreground"
          }`}
        />
      </Link>
      <Modal create={create} />
      {/* <Link href="/activity"> */}
      <Heart
        className={`w-6 h-6 cursor-not-allowed ${
          path === "/activity" ? "" : "text-muted-foreground"
        }`}
      />
      {/* </Link> */}
      <Link href={`/${username}`}>
        {/* <SignOutButton> */}
        {username === null ? (
          <User2 className="w-6 h-6 text-muted-foreground" />
        ) : (
          <User2
            className={`w-6 h-6 ${
              path === `/${username}` ? "" : "text-muted-foreground"
            }`}
          />
        )}
        {/* </SignOutButton> */}
      </Link>
    </div>
  );
}

export function Modal({
  create,
}: {
  create: {
    id: string;
    name: string;
    image: string;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Edit className={`w-[22px] h-[22px] text-muted-foreground`} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3">New Thread</DialogTitle>
        </DialogHeader>
        <Create create={create} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

export function Create({
  setOpen,
  create,
}: {
  setOpen: (open: boolean) => void;
  create: {
    id: string;
    name: string;
    image: string;
  };
}) {
  const [thread, setThread] = useState("");
  const [clicked, setClicked] = useState(false);

  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  useEffect(() => {
    if (clicked && !isPending) {
      setThread("");
      setOpen(false);
      setClicked(false);
      toast.success("Thread created");
    }
  }, [isPending]);

  return (
    <div>
      <div className="space-x-2 flex font-light">
        <div className="flex flex-col items-center justify-start">
          <UserAvatar src={create.image} name={`${create.name}'s avatar`} />
          <div className="w-0.5 grow mt-2 rounded-full bg-muted " />
        </div>
        <div className="w-full">
          <div className="font-semibold text-left">Me</div>
          <textarea
            value={thread}
            onChange={(e) => {
              if (e.target.value.length > 200) return;
              setThread(e.target.value);
            }}
            className="mt-1 mini-scrollbar text-base/relaxed resize-none h-16 bg-transparent w-full placeholder:text-muted-foreground pb-1 outline-none focus:border-b border-b-neutral-700"
            placeholder="Start a thread..."
          />
          <div className="mt-1 text-end font-medium text-xs text-muted-foreground">
            {thread.length}/200
          </div>
          {/* for adding attachments in the future */}
          {/* <Paperclip className="w-[18px] h-[18px] mt-3" /> */}
        </div>
      </div>
      <Button
        disabled={thread.length === 0 || isPending}
        variant="outline"
        className="w-full mt-4"
        onClick={() => {
          startTransition(() => createThread(thread, create.id, pathname));
          setClicked(true);
        }}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          "Post"
        )}
      </Button>
      {/* <div className="flex justify"></div> */}
    </div>
  );
}
