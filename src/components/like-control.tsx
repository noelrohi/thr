"use client";

import { likePost } from "@/app/(pages)/_actions";
import { Form } from "@/app/(pages)/_interactive";
import { useControl } from "@/hooks/control-provider";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  useActionState,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";

export function LikeControl({
  isLiked,
  postId,
}: {
  isLiked: boolean;
  postId: number;
}) {
  const { setLikes, likes } = useControl();
  const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(isLiked);
  const [_, startTransition] = useTransition();
  const pathname = usePathname();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (disabled) {
      setInterval(() => {
        setDisabled(false);
      }, 5000);
    }
  }, [disabled]);

  return (
    <button
      disabled={disabled}
      onClick={() => {
        setOptimisticIsLiked(!optimisticIsLiked);
        setLikes(likes + (optimisticIsLiked ? -1 : 1));
        startTransition(async () => {
          const formData = new FormData();
          formData.append("postId", postId.toString());
          formData.append("isLiked", optimisticIsLiked.toString());
          formData.append("pathname", pathname);
          const result = await likePost(undefined, formData);
          if (result && !result?.success) {
            setDisabled(true);
            toast.error(result.message);
          }
        });
      }}
      className={disabled ? "cursor-not-allowed" : ""}
      type="button"
    >
      <Heart
        className={cn(
          "size-5",
          optimisticIsLiked && "fill-red-500 text-red-500",
        )}
      />
    </button>
  );
}
