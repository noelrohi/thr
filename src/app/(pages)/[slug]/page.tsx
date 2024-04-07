import { currentUser } from "@/auth";
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
  return <div>{slug}</div>;
}
