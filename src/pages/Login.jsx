import { useState, useEffect } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { checkAdminExists } from "../services/authService"; 

export default function Login() {
  const nav = useNavigate();
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
    if (!email || !password) { setError("Please enter email and password."); return; }
    setLoading(true);
    try {

    const res = await login(email, password);
    const { token, username, email: userEmail } = res.data; 
  
  if (token) {

    localStorage.setItem("token", token);
    localStorage.setItem("userName",username); 
    localStorage.setItem("userEmail",userEmail);

    nav("/dashboard");
      } else { setError("Login failed: invalid response from server."); }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || "Login failed. Check credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }  
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-sky-700 to-cyan-500 p-6">
      <div className="max-w-4xl min-h-[420px] w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col justify-center px-8">
          <div className="text-white mb-6">
            <h1 className="text-5xl font-bold mb-2">TripGenix Admin</h1>
            <p className="text-white/80">Manage tours, bookings and users from a single dashboard.</p>
          </div>
        </div>
 
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-10 shadow-2xl border border-white/20 min-h-[520px] flex flex-col justify-center">
          <h2 className="text-2xl text-white font-semibold mb-1">Welcome back</h2>
          <p className="text-sm text-white/70 mb-6">Sign in to your admin account</p>
          {error && (<div className="bg-red-600/90 text-white text-sm px-4 py-2 rounded mb-4">{error}</div>)}

          <form onSubmit={handleSubmit} className="space-y-4">
        
            <label className="block">
              <span className="text-white/80 font-semibold text-sm">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg px-4 py-3 bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-sky-300" placeholder="admin@example.com" required/>
            </label>

            <label className="block relative">
              <span className="text-white/80 font-semibold text-sm">Password</span>
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg px-4 py-3 bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-sky-300 pr-12" placeholder="Your password" required/>
              <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-10 text-white/80">{showPw ? <FaEyeSlash /> : <FaEye />}</button>
            </label>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-white/80 font-semibold text-sm hover:underline">Forgot Password?</Link>
            </div>
    
            <button type="submit" className="w-full py-3 rounded-lg bg-white text-indigo-700 font-semibold hover:opacity-95 transition disabled:opacity-60 flex items-center justify-center gap-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center text-sm text-white/80 mt-6">
              {isCheckingAdmin ? (
                <span>Checking admin status...</span>
              ) : (
               !adminExists &&
                 (
                  <>
                    Don't have an account?{" "}
                    <Link to="/add-admin" className="text-white underline font-medium">Create one</Link>
                  </>
                )
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}