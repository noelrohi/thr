import Image from "next/image";
import Link from "next/link";

import { ExtendedThread } from "@/types";
import UserAvatar from "../profile/avatar";
import Controls from "./controls";
import MoreMenu from "./moreMenu";
import Others from "./others";

interface ItemProps {
  data: ExtendedThread;
  comment?: boolean;
  posts?: ExtendedThread[];
  noLink?: boolean;
  parent?: boolean;
}

export default function Item({
  data,
  comment = false,
  posts,
  noLink = false,
  parent = false,
}: ItemProps) {
  const mainClass = parent
    ? "px-3 pt-4 space-x-2 flex font-light"
    : comment
    ? `space-x-2 flex font-light ${noLink ? "pointer-events-none" : ""}`
    : `px-3 py-4 space-x-2 flex border-b font-light border-neutral-900 ${
        noLink ? "pointer-events-none" : ""
      }`;

  return (
    <>
      <div className={mainClass}>
        <div className="flex flex-col items-center justify-between">
          <Link href={`/${data.author.username}`}>
            <UserAvatar src={data.author.image} name={data.author.name} />
          </Link>
          <div
            className={`w-0.5 grow mt-2 rounded-full bg-muted  relative ${
              parent ? "mb-5" : null
            }`}
          >
            {parent ? (
              <div className="-bottom-7 absolute right-0 w-4 h-8">
                <Image
                  alt="loop"
                  src={"/assets/loop.svg"}
                  width={16}
                  height={32}
                  className="w-full h-full"
                />
              </div>
            ) : null}
          </div>
          {comment || parent || !data.replies ? null : (
            <Others replies={data.replies} />
          )}
        </div>
        <div className="w-full space-y-1">
          <div className="w-full flex items-center justify-between">
            <Link href={`/${data.author.username}`} className="font-semibold">
              {data.author.name}
            </Link>

            {comment ? null : (
              <div className="flex items-center space-x-2">
                <MoreMenu
                  name={data.author.name}
                  id={data.id}
                  author={data.author.clerkId}
                />
              </div>
            )}
          </div>
          <Link
            href={`/t/${data.id}`}
            className={
              comment
                ? "text-base/relaxed pb-3 text-left"
                : "text-base/relaxed text-left"
            }
          >
            {data.content}
          </Link>
          {comment ? null : (
            <>
              <Controls numPosts={posts ? posts.length : -1} data={data} />
              <div className="flex text-muted-foreground items-center space-x-2">
                {data.replies ? (
                  <Link href={`/t/${data.id}`}>
                    {data.replies.length}{" "}
                    {data.replies.length === 1 ? "reply" : "replies"}
                  </Link>
                ) : null}
                {data.replies && data.likes.length > 0 ? (
                  <div className="w-1 h-1 rounded-full " />
                ) : null}
                {data.likes.length > 0 ? (
                  <div>
                    {data.likes.length}{" "}
                    {data.likes.length === 1 ? "like" : "likes"}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
