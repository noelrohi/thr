"use client";
import { useClerk } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function SignInButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const { openSignIn } = useClerk();
  return (
    <div>
      <Button
        className={cn("w-full", className)}
        variant="outline"
        onClick={() => openSignIn()}
      >
        {children}
      </Button>
    </div>
  );
}
