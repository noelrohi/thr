"use client";

import { env } from "@/env.mjs";
import { Button } from "../ui/button";

export default function SelfShare({
  name,
  username,
}: {
  name: string;
  username: string;
}) {
  const shareData = {
    title: "Threads",
    text: "Link to " + name + "'s post on Threads",
    url: `${env.NEXT_PUBLIC_APP_URL}/${username}`,
  };

  return (
    <Button
      onClick={() => navigator.share(shareData)}
      variant="outline"
      className="w-full"
    >
      Share Profile
    </Button>
  );
}
