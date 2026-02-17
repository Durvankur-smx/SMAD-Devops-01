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
