"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { createPost } from "./_actions";

interface FormProps extends React.ComponentPropsWithoutRef<"form"> {
  actionString: keyof typeof formActions;
  loadingMessage?: string;
}

const formActions = {
  createPost,
} as const;

export function Form({
  children,
  actionString,
  loadingMessage = "Please wait ...",
  ...props
}: FormProps) {
  const [state, formAction] = useFormState(
    formActions[actionString],
    undefined,
  );
  useEffect(() => {
    if (state?.success === true) toast.success(state.message);
    if (state?.success === false) toast.error(state.message);
  }, [state]);

  return (
    <form {...props} action={formAction}>
      {children}
    </form>
  );
}

export function SubmitButton({
  children,
  disabled,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" {...props} disabled={disabled || pending}>
      {children}
    </Button>
  );
}
