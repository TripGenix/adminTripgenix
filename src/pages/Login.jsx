import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { checkAdminExists } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminExists, setAdminExists] = useState(true);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const exists = await checkAdminExists();
        setAdminExists(exists);
      } catch (err) {
        console.error("Failed to check admin status.", err);
        setAdminExists(true);
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    checkStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      console.log("Login response:", res);

      const { token, username, email: userEmail } = res.data;

      if (token) {
        authLogin(token);
        localStorage.setItem("userName", username);
        localStorage.setItem("userEmail", userEmail);
        nav("/dashboard");
      } else {
        setError("Login failed: invalid response from server.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Login failed. Check credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">TripGenix Admin</h1>
            <p className="text-slate-600 text-sm">
              Manage tours, bookings and users from a single dashboard.
            </p>
          </div>

          {/* Card Container for Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                Welcome back
              </h2>
              <p className="text-slate-600 text-sm">
                Sign in to your admin account
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg px-4 py-3 bg-white border border-slate-300 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg px-4 py-3 bg-white border border-slate-300 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-10 text-slate-500 hover:text-slate-700"
              >
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            </form>

            {isCheckingAdmin ? (
              <p className="text-center text-slate-600 text-sm mt-6">
                Checking admin status...
              </p>
            ) : (
              !adminExists && (
                <p className="text-center text-slate-600 text-sm mt-6">
                  Don't have an account?{" "}
                  <Link
                    to="/add-admin"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create one
                  </Link>
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Travel Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&auto=format&fit=crop"
            alt="Travel Adventure"
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 z-10">
          <div className="max-w-lg text-center">
            <h2 className="text-5xl font-bold mb-6">
              Explore the World
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Manage unforgettable travel experiences and create memories that last a lifetime. Your journey to exceptional tour management starts here.
            </p>
            <div className="mt-8 flex gap-8 justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold">500+</p>
                <p className="text-white/80 text-sm mt-1">Tours Managed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">10K+</p>
                <p className="text-white/80 text-sm mt-1">Happy Travelers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">50+</p>
                <p className="text-white/80 text-sm mt-1">Destinations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}