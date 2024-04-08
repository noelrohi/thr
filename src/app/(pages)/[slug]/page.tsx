import { currentUser, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

type PageProps = {
  params: {
    slug: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  let slug = params.slug;
  if (params.slug === "%40me") {
    const user = await currentUser();
    if (!user) throw new Error("User not found");
    slug = user.username;
  }
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button>Logout</Button>
      </form>
    </div>
  );
}
