import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  user: "myuser",
  password: "random",
  database: "local_pg",
});