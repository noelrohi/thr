import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function UserAvatar({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("w-8 h-8", className)}>
      <AvatarImage src={src} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
