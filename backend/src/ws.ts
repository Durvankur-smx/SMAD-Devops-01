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