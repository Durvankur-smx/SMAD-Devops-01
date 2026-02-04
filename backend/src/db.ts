import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "myuser",
  password: "random",
  database: "local_pg",
});
