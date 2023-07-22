import { Likes, Threads, Users } from "@/db/schema";

export interface UserData {
  id: string;
  username: string;
  name: string;
  bio: string | null;
  image: string;
}

export interface ThreadWithUsers extends Threads {
  author: Users;
}

export interface ExtendedThread extends Threads {
  author: Users;
  likes: Likes[];
  replies: ThreadWithUsers[] | null;
}
