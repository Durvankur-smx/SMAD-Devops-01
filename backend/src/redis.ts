import { createClient } from "redis";

export const pub = createClient({
    url:"redis://localhost:6379"
})
export const sub = pub.duplicate()
await pub.connect()
await sub.connect()
export interface ChatEvent {
  roomId: string;
  message: string;
  sender: {
    userId: string;
    email: string;
    name: string;
  };
  timestamp: string;
}

console.log("Redis connected")