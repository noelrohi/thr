"use client";

import { timeSince } from "@/lib/utils";

export default function Timestamp({ time }: { time: Date }) {
  return <div className="text-muted-foreground">{timeSince(time)}</div>;
}
