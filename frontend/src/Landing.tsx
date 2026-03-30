import { useEffect, useRef, useState } from "react";
import generateCode from "./utils/random-code";
import { useNavigate } from "react-router-dom";
function Landing() {
  const [roomId, setRoomId] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null)
  const [showCode,setShowCode] = useState<boolean>(false)
  const navigate = useNavigate()
  const createRoom = ()=>{
    const code = generateCode()
    setRoomId(code)
    if(inputRef.current){
      inputRef.current.value =code
    }
    setShowCode(true)

  }
  const joinRoom = () => {
   if(!roomId) return

    navigate(`/chat/${roomId}`)
  }
  const handleLogout = () =>{
    localStorage.removeItem("token")
    navigate("/login")
  }
  useEffect(()=>{
      if(!localStorage.getItem("token")){
          navigate("/login")
      }
    },[])
  return (
    <div className="w-full h-screen bg-black text-white flex justify-center items-center">
      <div className="border rounded border-white/20 max-w-xl w-full p-5 space-y-2">
        <p className="text-center text-3xl text-white/70 font-bold">
          The Chat Room
        </p>
        <p className="text-center text-sm text-white/70">
          Enter room code and join or create a room
        </p>
        <div className="flex-col flex sm:flex sm:flex-row  justify-center gap-2 min-w-3xs">
          <input
            type="text"
            className="  rounded py-2 ring-1 ring-white/20 focus:outline-none uppercase px-2"
            autoCapitalize={"characters"}
            onChange={(e) => setRoomId(e.target.value)}
            ref={inputRef}
          />
          <div className="border px-3 py-2 border-white/20 rounded flex items-center justify-center cursor-pointer" onClick={joinRoom} >Join</div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <button className="border border-white/20 rounded px-4 py-2 min-w-3xs cursor-pointer" onClick={createRoom}>
            Create a room
          </button>
          <button className="border border-red-500 text-red-500 rounded px-4 py-2 min-w-3xs cursor-pointer" onClick={handleLogout}>
            Logout
          </button>
        </div>
        {showCode && <div className="bg-white/10 py-4 space-y-2 mt-6">
        <p className="font-semibold text-base text-center  rounded">Room code share with your friends</p>
        <p className=" uppercase text-3xl font-semibold text-center" >{roomId}</p>
        </div>}
      </div>
    </div>
  );
}

export default Landing;
