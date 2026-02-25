import { Link } from "react-router-dom";
//change to navbar and add links to home, login, register by durvankur
export default function Navbar() {
  return (
    <nav style={{ padding: "20px", background: "#222" }}>
      <Link to="/" style={{ marginRight: "15px", color: "white" }}>
        Home
      </Link>
      <Link to="/login" style={{ marginRight: "15px", color: "white" }}>
        Login
      </Link>
      <Link to="/register" style={{ marginRight: "15px", color: "white" }}>
        Register
      </Link>
    </nav>
  );
}