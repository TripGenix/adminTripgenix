import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordRequest } from "../services/authService";
import { FaPaperPlane } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await forgotPasswordRequest(email);
      setMessage(" Password reset link has been sent.");
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-sky-700 to-cyan-500 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-2xl text-white font-semibold mb-1">Reset Password</h2>
        <p className="text-sm text-white/70 mb-6">Enter your admin email address to receive a password reset link.</p>

        {(message || error) && (
          <div className={`mb-4 px-4 py-2 rounded text-sm ${message ? "bg-green-600/90 text-white" : "bg-red-600/90 text-white"}`}>{message || error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-white/80 font-semibold text-sm">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg px-4 py-3 bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-sky-300" placeholder="admin@example.com" required/>
          </label>

          <button type="submit" className="w-full py-3 rounded-lg bg-white text-indigo-700 font-semibold hover:opacity-95 transition disabled:opacity-60 flex items-center justify-center gap-2" disabled={loading}>
            {loading ? "Sending..." : (<><FaPaperPlane /> Send Reset Link</>)}
          </button>
          
        </form>
        <div className="text-center text-sm text-white/80 mt-6">
          <Link to="/login" className="underline">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}