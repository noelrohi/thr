import Nav from "@/components/nav";
import Image from "next/image";

export default function ErrorWithNav() {
  return (
    <>
      <Nav
        create={{
          id: "",
          name: "",
          image: "",
        }}
        username={null}
      />
      <div className="flex items-center justify-center h-[50vh] w-full py-5">
        <div className="h-9 w-9 bg-cover">
          <Image
            src={"/assets/threads.svg"}
            width={64}
            height={64}
            alt="Threads logo"
            className="min-h-full invert min-w-full object-cover"
          />
        </div>
      </div>
      <div className="font-semibold text-center mt-24">
        Sorry, this page isn&apos;t available
      </div>
      <div className="text-center text-muted-foreground mt-4">
        The link you followed may be broken, or the page may have been removed.
      </div>
    </>
  );
}
