import { db } from "@/db";
import { Threads, users } from "@/db/schema";
import { ThreadWithUsers } from "@/types";
import { inArray } from "drizzle-orm";
import Image from "next/image";
import UserAvatar from "../profile/avatar";

export default function Others({ replies }: { replies: ThreadWithUsers[] }) {
  if (!replies) {
    return null;
  }

  if (replies.length === 0) {
    return null;
  }
  if (replies.length === 1) {
    return (
      <div className="w-5 h-5 relative mt-2">
        <UserAvatar
          src={replies[0].author.image}
          className="w-5 h-5 absolute top-0 left-0 overflow-hidden"
          name={replies[0].author.image + "'s profile image"}
        />
      </div>
    );
  }
  if (replies.length === 2) {
    return (
      <div className="w-8 h-8 relative mt-2">
        <UserAvatar
          src={replies[0].author.image}
          className="w-[18px] h-[18px] absolute top-0 left-0 overflow-hidden"
          name={replies[0].author.image + "'s profile image"}
        />
        <UserAvatar
          src={replies[0].author.image}
          className="w-4 h-4 absolute bottom-0 right-0 overflow-hidden"
          name={replies[0].author.image + "'s profile image"}
        />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 relative mt-2">
      <UserAvatar
        src={replies[0].author.image}
        className="w-4 h-4 absolute top-0 left-0 overflow-hidden"
        name={replies[0].author.image + "'s profile image"}
      />
      <UserAvatar
        src={replies[1].author.image}
        className="w-3.5 h-3.5 absolute top-[15%] right-0 overflow-hidden"
        name={replies[1].author.image + "'s profile image"}
      />
      <UserAvatar
        src={replies[2].author.image}
        className="w-3.5 h-3.5 absolute bottom-0 left-[15%] overflow-hidden"
        name={replies[2].author.image + "'s profile image"}
      />
    </div>
  );
}
