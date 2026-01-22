import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/dashboard");
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Enter email first");
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Hello! Welcome to <strong>Orderion</strong></h1>
        <p>Sign in to continue</p>

        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <span onClick={handleForgotPassword}>Forgot password?</span>
          <button>Login</button>
        </form>

        <div>or login with</div>

        <button onClick={loginWithGoogle}>Google</button>
        <button onClick={loginWithGithub}>GitHub</button>

        <p>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
