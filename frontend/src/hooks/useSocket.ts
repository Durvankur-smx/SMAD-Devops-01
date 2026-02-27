import { useEffect, useRef, useState } from "react";
interface MessageType {
  type: "socket" | "client";
  message: string;
  email?: string;
  timestamp?: Date;
  name?: string;
}
interface IncomingMessageType{
  message: string
  type:"chat" | "typing" | "user_joined" | "user_left"
  sender: {
    userId: string;
    email: string;
    name: string;
  };
  senderSocketId:string
  timestamp: Date;
}
export interface JoinedUserType{
  id:string,
  name:string
}
const useSocket = (url: string) => {
  const socket = useRef<WebSocket>(null);
  const [totalMessage, setTotalMessage] = useState<MessageType[]>([]);
  const [socketState, setSocketSet] = useState<number>(WebSocket.CLOSED);
  const [typingUsers,setTypingUsers] = useState<Set<string>>(new Set())
  const [lastJoinedUser, setLastJoinedUser] = useState<JoinedUserType>();
  const typingTimeouts = useRef<{ [key: string]: number }>({});
  const sendMessage = (m: string) => {
    if (socket.current) {
      socket.current.send(m);
    }
  };
  useEffect(() => {
    socket.current = new WebSocket(url);
    
    socket.current.onopen = () => {
      setSocketSet(WebSocket.OPEN);
      
    };
    socket.current.onclose = () => {
      setSocketSet(WebSocket.CLOSED);
    };
    socket.current.onmessage = (ev) => {
      const data = JSON.parse(ev.data) as IncomingMessageType
      if(data.type === "typing")
        {const userName = data.sender.name;

        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.add(userName);
          return newSet;
        });

        if (typingTimeouts.current[userName]) {
          clearTimeout(typingTimeouts.current[userName]);
        }

        typingTimeouts.current[userName] = window.setTimeout(() => {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userName);
            return newSet;
          });
          delete typingTimeouts.current[userName];
        }, 3000);
        
        return; 
      }
      
      if(data.type === "user_joined"){
        setLastJoinedUser({
          id:data.senderSocketId,
          name:data.sender.name
        });
        return;
      } 
        
        if(data.type === "chat"){
        setTotalMessage((prev) => [
        ...prev,
        {
          type: "socket",
          message: data.message,
          email: data.sender.email,
          name: data.sender.name,
          timestamp: new Date(data.timestamp),
        },
      ]);
      }
      
    };

    socket.current.onerror = (error) => {
      sendMessage(JSON.stringify({type:"user_left"}))
      console.log(error);
    };

    return () => {
      sendMessage(JSON.stringify({type:"user_left"}))
      socket.current?.close();
    };
  }, [url]);

  return { sendMessage, totalMessage, socketState, setTotalMessage,typingUsers,lastJoinedUser };
};

export default useSocket;