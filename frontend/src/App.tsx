import {  Route, Routes } from "react-router-dom";
import Landing from "./Landing";
import Chat from "./Chat";
import Login from "./Login";
import SignUp from "./SignUp";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/chat/:roomid" element={<Chat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
    </Routes>
  );
}