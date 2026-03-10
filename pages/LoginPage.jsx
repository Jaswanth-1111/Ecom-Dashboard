import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Page.css"

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);
  const [data, setData] = useState({ email: "", password: "" });

  const update = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="signupPage">
      <form className="signupBox" onSubmit={submit}>
        <h2>Login</h2>
        <div className="inputIcon">
          <FaEnvelope />
          <input name="email" placeholder="Email" onChange={update} required />
        </div>
        <div className="inputIcon">
          <FaLock />
          <input name="password" type="password" placeholder="Password" onChange={update} required />
        </div>

        {error && <p className="error" style={{ color: "red" }}>{error}</p>}

        <button className="primaryBtn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <button type="button" onClick={() => navigate("/signup")} className="linkBtn">
          Create Account
        </button>
      </form>
    </div>
  );
}