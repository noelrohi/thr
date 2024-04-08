import { env } from "@/env";
import { Ratelimit } from "@unkey/ratelimit";

export const unkey = new Ratelimit({
  rootKey: env.UNKEY_ROOT_KEY,
  namespace: "my-app",
  limit: 2,
  duration: "10s",
  async: true,
});
