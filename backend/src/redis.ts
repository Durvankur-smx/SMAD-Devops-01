import Redis from "ioredis";

// publisher
export const pub = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

// subscriber
export const sub = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

sub.on("connect", () => {
  console.log("Redis Subscriber Connected");
});

pub.on("connect", () => {
  console.log("Redis Publisher Connected");
});
