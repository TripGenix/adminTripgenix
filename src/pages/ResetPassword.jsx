import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordConfirm } from "../services/authService";
import { FaKey, FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token'); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (!token) {
    return <div className="p-10 text-center text-red-500">Error: Missing password reset token.</div>;
  }

  const validate = () => {
    if (newPassword.length < 6) return "New password must be at least 6 characters.";
    if (newPassword !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const err = validate();
    if (err) return setError(err);

    setLoading(true);

    try {
      await resetPasswordConfirm(token, newPassword);

      setMessage('Password successfully changed!');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || "Reset failed. Invalid or expired token.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-sky-700 to-cyan-500 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-2xl text-white font-semibold mb-1">Set New Password</h2>
        <p className="text-sm text-white/70 mb-6">Enter and confirm your new password.</p>

        {(message || error) && (
          <div className={`mb-4 px-4 py-2 rounded text-sm ${message ? "bg-green-600/90 text-white" : "bg-red-600/90 text-white"}`}>
            {message || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <label className="block relative">
            <span className="text-white/80 font-semibold text-sm">New Password</span>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg px-4 py-3 bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Minimum 6 characters"
              required
            />

            <span
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-[44px] text-white/80 cursor-pointer text-lg"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>

          <label className="block relative">
            <span className="text-white/80 font-semibold text-sm">Confirm Password</span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg px-4 py-3 bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Repeat new password"
              required
            />

            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-[44px] text-white/80 cursor-pointer text-lg"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-white text-indigo-700 font-semibold hover:opacity-95 transition disabled:opacity-60 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Updating..." : (<><FaKey /> Change Password</>)}
          </button>

        </form>
      </div>
    </div>
  );
}
