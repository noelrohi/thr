"use client";

import * as React from "react";

export const ControlContext = React.createContext<{
  likes: number;
  setLikes: (likes: number) => void;
  replies: number;
  setReplies: (replies: number) => void;
}>({ likes: 0, setLikes: () => {}, replies: 0, setReplies: () => {} });

export function useControl() {
  const control = React.useContext(ControlContext);
  if (!control) {
    throw new Error("useControl must be used within a ControlProvider");
  }
  return control;
}
