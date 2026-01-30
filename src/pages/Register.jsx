import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { FaCheck, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const validate = () => {
    if (!username.trim()) return "Username required";
    if (!email.includes("@")) return "Valid email required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirm) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    const err = validate();
    if (err) return setMsg({ type: "error", text: err });

    setLoading(true);

    try {
      await register(username, email, password); 
      setMsg({ type: "success", text: "Admin created successfully." });
      setTimeout(() => nav("/login"), 1500);
    
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || "Signup failed.";
      setMsg({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Back Button */}
      <Link 
        to="/dashboard" 
        className="absolute top-6 left-6 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg transition"
      >
        <FaArrowLeft className="h-5 w-5 text-slate-700" />
      </Link>

      {/* Left Section - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12">
        <div className="max-w-lg w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">TripGenix Admin</h1>
            <p className="text-slate-600 text-sm">
              Manage tours, bookings and users from a single dashboard.
            </p>
          </div>

          {/* Card Container for Register Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-250">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                Create Admin
              </h2>
              <p className="text-slate-600 text-sm">
                Register a new admin account
              </p>
            </div>

            {msg && (
              <div className={`mb-4 p-3 rounded-lg ${
                msg.type === "error" 
                  ? "bg-red-50 border border-red-200 text-red-600" 
                  : "bg-green-50 border border-green-200 text-green-600"
              }`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full rounded-lg px-4 py-2 bg-white border border-slate-300 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Admin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg px-4 py-2 bg-white border border-slate-300 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="mt-1 w-full rounded-lg px-4 py-2 bg-white border border-slate-300 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
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

              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPw ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-1 w-full rounded-lg px-4 py-2 bg-white border border-slate-300 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Repeat password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw((s) => !s)}
                  className="absolute right-3 top-10 text-slate-500 hover:text-slate-700"
                >
                  {showConfirmPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? "Creating..." : (
                  <>
                    <FaCheck />
                    <span>Create Admin</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-sm text-slate-600 mt-6">
              Already an admin?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </div>
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
              Join Our Team
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Create your admin account and start managing exceptional travel experiences. Empower your team to deliver unforgettable journeys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}