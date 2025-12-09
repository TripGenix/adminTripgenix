import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { FaCheck, FaArrowLeft,FaEye,FaEyeSlash } from "react-icons/fa";

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

    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600 p-6">
      <Link to="/dashboard" className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-full bg-purple-300 hover:bg-blue-100 shadow-lg transition"><FaArrowLeft className="h-6 w-6 text-blue-700" /></Link>
      <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-2xl p-8 shadow-lg border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-1">Create Admin</h2>
        <p className="text-sm font-semibold text-white/70 mb-6">Register a new admin account</p>
        {msg && (<div className={`mb-4 px-4 py-2 rounded ${msg.type === "error" ? "bg-red-600/90 text-white" : "bg-green-600/90 text-white"}`}>{msg.text}</div>)}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-white/85 font-semibold text-sm">Username</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full rounded-lg px-4 py-3 bg-white/20 text-white outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Admin" required/>
          </label>
          <label className="block">
            <span className="text-white/85 font-semibold text-sm">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg px-4 py-3 bg-white/20 text-white outline-none focus:ring-2 focus:ring-indigo-300" placeholder="admin@example.com" required/>
          </label>
          <label className="block">
            <span className="text-white/85 font-semibold text-sm">Password</span>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg px-4 py-3 bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-sky-300 pr-12"
                placeholder="Your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80"
              >
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>
          <label className="block">
            <span className="text-white/85 font-semibold text-sm">Confirm password</span>
            <div className="relative">
              <input
                type={showConfirmPw ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full rounded-lg px-4 py-3 bg-white/20 text-white outline-none focus:ring-2 focus:ring-indigo-300 pr-12"
                placeholder="Repeat password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80"
              >
                {showConfirmPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>
          <button type="submit" className="w-full py-3 font-semibold rounded-lg bg-white text-indigo-700 hover:opacity-95 transition disabled:opacity-60 flex items-center justify-center gap-2" disabled={loading}>
            {loading ? "Creating..." : (<><FaCheck /> Create Admin</>)}
          </button>
        </form>

        <div className="text-center font-semibold text-sm text-white/80 mt-6">
          Already an admin? <Link to="/login" className="underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}