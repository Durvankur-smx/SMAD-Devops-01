import axios from "axios";
import React, {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const navigate = useNavigate();
  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      console.log(res.data);
      const { token } = res.data;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    if(localStorage.getItem("token")){
        navigate("/")
    }
  },[])
  return (
    <div className="w-full h-screen bg-black text-white flex justify-center items-center">
      <div className="border rounded border-white/20 max-w-xl w-full p-5 space-y-4">
        <p className="text-center text-4xl font-semibold">Login</p>
        <div className=" flex flex-col  justify-center gap-3 min-w-3xs ">
          <input
            type="email"
            className="  rounded py-1 ring-1 ring-white/20 focus:outline-none  px-2"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="  rounded py-1 ring-1 ring-white/20 focus:outline-none  px-2"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="border border-white/20 bg-white rounded px-4 py-1  cursor-pointer text-black font-semibold"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
