import http from "http";
import { config } from "dotenv";
import { URL } from "url";
import { pool } from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import ws from "./ws.js";
config();

const PORT = process.env.PORT;
export const JWT_SECRET = process.env.SECRET;
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  const { method, url } = req;
  const parsedURL = new URL(url!, `http://${req.headers.host}`);
  if (method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }


  if (method === "POST" && parsedURL.pathname === "/login") {
    let body = "";
    req.on("data", (chunks) => {
      body += chunks;
    });
    req.on("end", async () => {
      try {
        const { email, password } = JSON.parse(body);
        const result = await pool.query(
          "SELECT id, password_hashed, name FROM users WHERE email = $1",
          [email]
        );
        if (result.rowCount === 0) {
          res.statusCode = 401;
          return res.end("Invalid credentials");
        }
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hashed);
        if (!match) {
          res.statusCode = 401;
          return res.end("Invalid credentials");
        }

        const token = jwt.sign({ userId: user.id, email,name:user.name }, JWT_SECRET!);

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ token }));
      } catch (err) {
        console.log(err);
        res.statusCode = 500;
        return res.end("Internal Server Error");
      }
    });
    return;
  }