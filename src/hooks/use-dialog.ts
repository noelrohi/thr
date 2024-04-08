"use client";

import * as React from "react";

export const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

export function useDialog() {
  const dialog = React.useContext(DialogContext);
  if (!dialog) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return dialog;
}
