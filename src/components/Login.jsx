import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Aurora from "../components/ReactBits/Aurora";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const navigate = useNavigate();

  // Login function from store
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend API Call
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // checks if the token is present in the res or not
      if (!res.data.token) {
         throw new Error("Login successful but Token missing from server!");
      }

      // Save data in store (Zustand) & localStorage
      login(res.data.user, res.data.token);

      toast.success("Welcome back!");
      navigate("/dashboard"); // jump to Dashboard
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || error.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} speed={0.5}>
      {/* grid */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "linear-gradient(transparent 0, rgba(255,255,255,0.035) 1.5px), linear-gradient(90deg, transparent 0, rgba(255,255,255,0.035) 1px)",
          backgroundSize: "48px 48px",
          mixBlendMode: "overlay",
          transform: "translateZ(0)",
          opacity: 0.9,
        }}
        aria-hidden="true"
      />

      <div className="min-h-screen flex items-center justify-center px-4 relative z-20">
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400 text-sm">
              Log in to track your expenses
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 font-medium transition"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </Aurora>
  );
};

export default Login;