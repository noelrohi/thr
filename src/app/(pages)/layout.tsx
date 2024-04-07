import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ActiveLink } from "./_interactive";
import { Edit, Heart, Home, IceCream, Search, User2 } from "lucide-react";
import { ThreadIcon } from "@/components/icons";

interface StickyLayoutProps {
  children: React.ReactNode;
}

export default async function StickyLayout({ children }: StickyLayoutProps) {
  return (
    <div className="relative mx-auto flex h-screen max-w-[500px] flex-col py-4">
      <ThreadIcon className="mx-auto size-9" />
      <main className="flex-1 overflow-auto px-2">{children}</main>
      <nav className="flex justify-around gap-2">
        <ActiveLink href="/">
          <Home className="size-6" />
        </ActiveLink>
        <ActiveLink href="/search">
          <Search className="size-6" />
        </ActiveLink>
        <Edit className="size-6" />
        <ActiveLink href={"#"}>
          <Heart className="size-6" />
        </ActiveLink>
        <ActiveLink href="/@me">
          <User2 className="size-6" />
        </ActiveLink>
      </nav>
    </div>
  );
}
