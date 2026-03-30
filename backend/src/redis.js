import { createClient } from "redis";
export const pub = createClient({
    url: "redis://localhost:6379"
});
export const sub = pub.duplicate();
await pub.connect();
await sub.connect();
console.log("Redis connected");
//# sourceMappingURL=redis.js.map