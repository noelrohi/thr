"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form as RHForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";
import { useDialog } from "@/hooks/use-dialog";
import { cn } from "@/lib/utils";
import type { UserWithDetails } from "@/types";
import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  createPost,
  createThread,
  followOrUnfollow,
  likePost,
  updateUserDetails,
} from "./_actions";

interface FormProps extends React.ComponentPropsWithoutRef<"form"> {
  actionString: keyof typeof formActions;
}

const formActions = {
  createPost,
  updateUserDetails,
  likePost,
  followOrUnfollow,
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
      {pending ? (
        <Loader2 className="mr-2 inline-flex size-4 animate-spin items-center" />
      ) : null}
      {children}
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
      className={cn(
        "inline-flex flex-1 items-center hover:bg-border",
        className,
        pathname !== props.href && "opacity-75",
      )}
    >
      {children}
    </Link>
  );
}

export function AddRelatedThread({ avatar }: { avatar: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [replyCount, setReplyCount] = useState(0);
  const inputLength = Number(searchParams.get(`length.${replyCount}`));
  console.log({ inputLength, replyCount });
  return <></>;
}

type CreateThreadInputProps = React.ComponentPropsWithoutRef<typeof Input>;

export function CreateThreadInput({
  className,
  ...props
}: CreateThreadInputProps) {
  return (
    <Input
      className={cn(
        "border-0 p-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
        className,
      )}
      {...props}
    />
  );
}

interface FormValues {
  post: Array<{
    text: string;
  }>;
}

export function ThreadFormInputs({ user }: { user: UserWithDetails }) {
  const { setOpen, open } = useDialog();
  console.log({ open });
  const form = useForm<FormValues>({
    defaultValues: {
      post: [{ text: "" }],
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    name: "post",
    control: form.control,
  });
  const [isPending, startTransition] = useTransition();
  const path = usePathname();

  const watchedForm = useWatch({ name: "post", control: form.control });
  const inputLength = watchedForm[watchedForm.length - 1].text?.length ?? 0;

  return (
    <RHForm {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          startTransition(async () => {
            const formData = new FormData();
            formData.append("post", JSON.stringify(data.post));
            const { success, message } = await createThread(data.post, path);
            if (success) {
              toast.success(message);
              setOpen(false);
            } else {
              toast.error(message);
            }
          });
        })}
      >
        <div className="flex flex-col gap-2">
          {fields.map((field, i) => {
            return i === 0 ? (
              <div className="flex gap-2" key={field.id}>
                <UserAvatar src={user.image ?? ""} alt={user.username} />
                <div className="flex flex-col">
                  <div className="font-semibold">{user.username}</div>
                  <FormField
                    control={form.control}
                    name="post.0.text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CreateThreadInput
                            {...field}
                            placeholder="Start a thread ..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ) : (
              <div className={"relative mb-5"} key={field.id}>
                <Separator
                  className="-translate-y-[1.5rem] absolute left-[18px] h-[1.2rem] w-0.5 bg-muted"
                  orientation="vertical"
                />
                <div className={"flex items-center gap-2"}>
                  <UserAvatar
                    className="ml-2 size-6"
                    src={user.image ?? ""}
                    alt={user.username}
                  />
                  {fields.length !== i ? (
                    <div className="flex flex-1">
                      <FormField
                        control={form.control}
                        name={`post.${i}.text`}
                        render={({ field }) => (
                          <FormItem className="ml-2 w-full">
                            <FormControl>
                              <CreateThreadInput
                                placeholder="Say more ..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <button
                        onClick={() => {
                          remove(i);
                        }}
                        type="button"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={cn(
                        "ml-2 h-fit text-muted-foreground text-sm",
                        inputLength < 1 && "cursor-not-allowed",
                      )}
                      disabled={inputLength < 1}
                    >
                      Add to thread
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div className="relative">
            <Separator
              className="-translate-y-[1.8rem] absolute left-[18px] h-6 w-0.5 bg-muted"
              orientation="vertical"
            />
            <div className="flex items-center gap-2 opacity-60">
              <UserAvatar
                className="ml-2 size-6"
                src={user.image ?? ""}
                alt={user.username}
              />
              <button
                onClick={() => append({ text: "" })}
                type="button"
                className={cn(
                  "ml-2 h-fit text-sm",
                  inputLength < 1 && "cursor-not-allowed",
                )}
                disabled={inputLength < 1}
              >
                Add to thread
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button className="rounded-3xl">
            {isPending ? "Posting ..." : "Post"}
          </Button>
        </div>
      </form>
    </RHForm>
  );
}
