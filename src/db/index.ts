import * as schema from "@/db/schema";
import { env } from "@/env";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

export { projectTable as tableCreator } from "@/db/utils";

const connection = new Pool({
  connectionString: env.DATABASE_URL,
});
export const db = drizzle(connection, { schema });
