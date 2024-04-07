import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({
  src,
  alt,
  fallback,
  className,
}: {
  src: string;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
