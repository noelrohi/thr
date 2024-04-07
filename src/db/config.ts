import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema",
  driver: "pg",
  out: "./src/db",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: [env.TABLE_PREFIX],
  verbose: true,
  strict: true,
});
