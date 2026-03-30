import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import jwt from "jsonwebtoken";
import pkg from "jsonwebtoken";
import { JWT_SECRET } from "./index.js";
import { pub, sub } from "./redis.js";
const { JsonWebTokenError } = pkg;
const roomToSockets = new Map();
const socketsToRoom = new Map();
const subscribedRooms = new Set();
async function subscribeRoom(roomId) {
    const channel = `room:${roomId}`;
    if (subscribedRooms.has(channel))
        return; // 🔒 critical
    await sub.subscribe(channel, (message) => {
        const event = JSON.parse(message);
        const sockets = roomToSockets.get(event.roomId);
        if (!sockets)
            return;
        sockets.forEach((s) => {
            if (s.id === event.senderSocketId)
                return;
            s.send(JSON.stringify(event));
        });
    });
    subscribedRooms.add(channel);
}
export default function ws(server) {
    const ws = new WebSocketServer({ server }, () => {
        console.log("Socket server running ");
    });
    const heartBeat = setInterval(() => {
        ws.clients.forEach((socket) => {
            const s = socket;
            if (s.isAlive === false)
                return socket.terminate();
            s.isAlive = false;
            socket.ping();
        });
    }, 30_000);
    const cleanup = (socket) => {
        const roomId = socketsToRoom.get(socket);
        socketsToRoom.delete(socket);
        if (!roomId)
            return;
        const sockets = roomToSockets.get(roomId);
        sockets?.delete(socket);
        if (sockets?.size === 0)
            roomToSockets.delete(roomId);
    };
    ws.on("connection", (socket, req) => {
        console.log("socket connected", socket.user?.userId);
        try {
            const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get("token");
            if (!token) {
                socket.close(4001, "Not authorized!");
                return;
            }
            const decoded = jwt.verify(token, JWT_SECRET);
            socket.user = {
                userId: decoded.userId,
                email: decoded.email,
                name: decoded.name,
            };
        }
        catch (err) {
            if (err instanceof JsonWebTokenError)
                return socket.close(4002, "Invalid token");
            socket.close();
            return;
        }
        socket.isAlive = true;
        socket.on("pong", () => {
            socket.isAlive = true;
        });
        socket.id = crypto.randomUUID();
        socket.on("message", (event) => {
            let parsedMessage;
            try {
                parsedMessage = JSON.parse(event.toString());
            }
            catch (error) {
                return;
            }
            if (parsedMessage.type === "join") {
                const prevRoom = socketsToRoom.get(socket);
                if (prevRoom)
                    roomToSockets.get(prevRoom)?.delete(socket);
                if (!roomToSockets.has(parsedMessage.roomId)) {
                    roomToSockets.set(parsedMessage.roomId, new Set());
                }
                roomToSockets.get(parsedMessage.roomId)?.add(socket);
                socketsToRoom.set(socket, parsedMessage.roomId);
                subscribeRoom(parsedMessage.roomId);
                const roomId = socketsToRoom.get(socket);
                const event = {
                    type: "user_joined",
                    roomId,
                    sender: socket.user,
                    senderSocketId: socket.id,
                };
                pub.publish(`room:${roomId}`, JSON.stringify(event));
            }
            if (parsedMessage.type === "chat") {
                const roomId = socketsToRoom.get(socket);
                if (!roomId)
                    return;
                const event = {
                    roomId,
                    message: parsedMessage.message,
                    sender: socket.user,
                    senderSocketId: socket.id,
                    timestamp: new Date().toISOString(),
                };
                console.log("PUBLISH", roomId, socket.user?.userId);
                pub.publish(`room:${roomId}`, JSON.stringify(event));
            }
            if (parsedMessage.type === "typing") {
                const roomId = socketsToRoom.get(socket);
                if (!roomId)
                    return;
                const event = {
                    type: "typing",
                    roomId,
                    sender: socket.user,
                    senderSocketId: socket.id,
                };
                pub.publish(`room:${roomId}`, JSON.stringify(event));
            }
            if (parsedMessage.type === "user_joined") {
                const roomId = socketsToRoom.get(socket);
                if (!roomId)
                    return;
                const event = {
                    type: "user_joined",
                    roomId,
                    sender: socket.user,
                    senderSocketId: socket.id,
                };
                pub.publish(`room:${roomId}`, JSON.stringify(event));
            }
            if (parsedMessage.type === "user_left") {
                const roomId = socketsToRoom.get(socket);
                if (!roomId)
                    return;
                const event = {
                    type: "user_left",
                    roomId,
                    sender: socket.user,
                    senderSocketId: socket.id,
                };
                pub.publish(`room:${roomId}`, JSON.stringify(event));
            }
            if (parsedMessage.type === "exit") {
                cleanup(socket);
            }
        });
        socket.on("close", () => {
            cleanup(socket);
        });
    });
    ws.on("close", () => {
        clearInterval(heartBeat);
    });
}
//sdffasds
//# sourceMappingURL=ws.js.map