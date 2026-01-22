import { useState } from "react";
import "./Auth.css";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* HEADER */}
        <div className="auth-header">
          <h1>Hello!</h1>
          <p>
            {mode === "login"
              ? "Welcome back to Orderion"
              : "Create your Orderion account"}
          </p>
        </div>

        {/* FORM */}
        <form className="auth-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          {mode === "signup" && (
            <>
              <input type="password" placeholder="Confirm Password" required />
              <input type="tel" placeholder="Phone" />
            </>
          )}

          {mode === "login" && (
            <a href="#" className="forgot">
              Forgot password?
            </a>
          )}

          <button type="submit" className="auth-btn">
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* SOCIAL */}
        {mode === "login" && (
          <>
            <div className="divider">or login with</div>
            <div className="social">
              <button>f</button>
              <button>G</button>
              <button></button>
            </div>
          </>
        )}

        {/* FOOTER */}
        <p className="switch">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setMode("signup")}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Login</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
