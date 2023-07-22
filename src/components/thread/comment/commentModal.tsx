"use client";

import Item from "@/components/thread";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExtendedThread } from "@/types";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Create } from ".";

export function Modal({ data }: { data: ExtendedThread }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <MessageCircle className="w-5 h-5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-3">Reply</DialogTitle>
          </DialogHeader>
          <Item data={data} noLink comment />
          <Create setOpen={setOpen} itemData={data} />
        </DialogContent>
      </Dialog>
    </>
  );
}
