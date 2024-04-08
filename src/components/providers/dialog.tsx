"use client";

import { Dialog } from "@/components/ui/dialog";
import { DialogContext } from "@/hooks/use-dialog";
import * as React from "react";

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
