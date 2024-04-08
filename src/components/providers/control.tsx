"use client";

import { ControlContext } from "@/hooks/control-provider";
import * as React from "react";

export function ThreadActionsProvider({
  children,
  likes: likeCount,
  replies: replyCount,
}: {
  children: React.ReactNode;
  likes: number;
  replies: number;
}) {
  const [likes, setLikes] = React.useState(likeCount);
  const [replies, setReplies] = React.useState(replyCount);
  const value = React.useMemo(
    () => ({ likes, setLikes, replies, setReplies }),
    [likes, replies],
  );
  return (
    <ControlContext.Provider value={value}>{children}</ControlContext.Provider>
  );
}
