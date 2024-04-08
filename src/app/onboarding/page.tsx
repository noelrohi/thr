import { auth, currentUser } from "@/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { Form, SubmitButton } from "../(pages)/_interactive";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/signin");
  const userDetails = await db.query.userDetails.findFirst({
    where: (table, { eq }) => eq(table.userId, session.user.id),
  });
  console.log("here at onboarding");
  if (userDetails?.username != null) redirect("/");
  return (
    <>
      <Dialog open={true}>
        <DialogContent showClose={false}>
          <DialogTitle>Hi there!</DialogTitle>
          <DialogDescription>
            Please fill out the form below to get started.
          </DialogDescription>
          <Form actionString="updateUserDetails">
            <input type="hidden" name="userId" value={session.user.id} />
            <div className="flex flex-col gap-2">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input type="text" id="username" name="username" />
              </div>
              <div>
                <Label htmlFor="fullname">Full Name</Label>
                <Input type="text" id="fullname" name="fullname" />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" />
              </div>
              <div className="flex justify-end gap-2">
                <SubmitButton>Submit</SubmitButton>
              </div>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
