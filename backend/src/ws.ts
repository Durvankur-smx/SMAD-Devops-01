import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import jwt from "jsonwebtoken";
import pkg from "jsonwebtoken";
import { JWT_SECRET } from "./index.js";
import { pub, sub } from "./redis.js";
const { JsonWebTokenError } = pkg;
interface AuthedSocket extends WebSocket {
  id?: string;
  user?: {
    userId: string;
    email: string;
    name: string;
  };
}
type Message =
  | {
      type: "join";
      roomId: string;
    }
  | {
      type: "chat";
      message: string;
    }
  | {
      type: "exit";
    }
  | {
      type: "typing";
    }
  | {
      type: "user_joined";
    }
  | {
      type: "user_left";
    };
const roomToSockets = new Map<string, Set<WebSocket>>();
const socketsToRoom = new Map<WebSocket, string>();
const subscribedRooms = new Set<string>();

async function subscribeRoom(roomId: string) {
  const channel = `room:${roomId}`;

  if (subscribedRooms.has(channel)) return; // 🔒 critical

  await sub.subscribe(channel, (message) => {
    const event = JSON.parse(message);

    const sockets = roomToSockets.get(event.roomId);
    if (!sockets) return;

    sockets.forEach((s: AuthedSocket) => {
      if ((s as any).id === event.senderSocketId) return;
      s.send(JSON.stringify(event));
    });
  });

  subscribedRooms.add(channel);


}

export default function ws(server: http.Server) {
  const ws = new WebSocketServer({ server }, () => {
    console.log("Socket server running ");
  });
  const heartBeat = setInterval(() => {
    ws.clients.forEach((socket) => {
      const s = socket as any;
      if (s.isAlive === false) return socket.terminate();
      s.isAlive = false;
      socket.ping();
    });
  }, 30_000);
  const cleanup = (socket: WebSocket) => {
    const roomId = socketsToRoom.get(socket);
    socketsToRoom.delete(socket);
    if (!roomId) return;
    const sockets = roomToSockets.get(roomId);
    sockets?.delete(socket);
    if (sockets?.size === 0) roomToSockets.delete(roomId);
  };
}