import http from "http";
import { config } from "dotenv";
import { URL } from "url";
import { pool } from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import ws from "./ws.js";
config();

