import "./navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">Orderion</div>

      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/pricing">Pricing</a>
        <a href="/products">Products</a>
      </nav>

      <div className="nav-actions">
        <button className="icon-btn">☀️</button>
        <a href="/login" className="signin">Sign In</a>
        <button className="signup">Sign Up →</button>
      </div>
    </header>
  );
}
