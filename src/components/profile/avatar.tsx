import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function UserAvatar({
  src,
  name,
}: {
  src: string;
  name: string;
}) {
  return (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
