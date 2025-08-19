import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? "/auth/login" : "/auth/signup";

    try {
      const res = await fetch("http://localhost:4000" + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin && data.token) {
          localStorage.setItem("token", data.token);
        }
        alert(isLogin ? "Login successful!" : "Signup successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        {/* Logo */}
        <h4 className="text-center text-primary fw-bold mb-3">workasana</h4>

        {/* Title */}
        <h5 className="text-center mb-2">
          {isLogin ? "Log in to your account" : "Create your account"}
        </h5>
        <p className="text-center text-muted small mb-4">
          {isLogin
            ? "Please enter your details."
            : "Fill in the form to sign up."}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {isLogin ? "Sign in" : "Sign up"}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link p-0 text-decoration-none"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
