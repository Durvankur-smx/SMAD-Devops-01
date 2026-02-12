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
  console.log()
  console.log()
  console.log()
  console.log()
  console.log()
  console.log()
}