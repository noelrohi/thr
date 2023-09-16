"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { env } from "@/env.mjs";
import { Link, Send, Share } from "lucide-react";
import { toast } from "sonner";

export default function ShareButton({
  post,
  name,
}: {
  post: number;
  name: string;
}) {
  const shareData = {
    title: "Threads",
    text: "Link to " + name + "'s post on Threads",
    url: env.NEXT_PUBLIC_APP_URL + "/" + post,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {" "}
        <Send className="w-[18px] h-[18px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(shareData.url);
            toast.success("Copied to clipboard");
          }}
        >
          {" "}
          <Link className="mr-2 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.share(shareData);
          }}
        >
          {" "}
          <Share className="mr-2 h-4 w-4" />
          Share Via...
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
