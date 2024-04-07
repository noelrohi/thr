"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { createPost, updateUserDetails } from "./_actions";
import { Loader2 } from "lucide-react";

interface FormProps extends React.ComponentPropsWithoutRef<"form"> {
  actionString: keyof typeof formActions;
}

const formActions = {
  createPost,
  updateUserDetails,
} as const;

export function Form({ children, actionString, ...props }: FormProps) {
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
      {pending ? <Loader2 className="size-4 animate-spin" /> : children}
    </Button>
  );
}

export function ActiveLink({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(className, pathname !== props.href && "opacity-75")}
    >
      {children}
    </Link>
  );
}
