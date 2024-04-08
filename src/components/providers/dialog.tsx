"use client";

import { Dialog } from "@/components/ui/dialog";
import * as React from "react";
import { DialogContext } from "@/hooks/use-dialog";

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(() => ({ open, setOpen }), [open]);
  return (
    <DialogContext.Provider value={value}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
      </Dialog>
    </DialogContext.Provider>
  );
}
