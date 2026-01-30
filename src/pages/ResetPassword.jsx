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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <p className="text-red-500 text-center">Error: Missing password reset token.</p>
        </div>
      </div>
    );
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
    <div className="min-h-screen flex">
      {/* Left Section - Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">TripGenix Admin</h1>
            <p className="text-slate-600 text-sm">
              Manage tours, bookings and users from a single dashboard.
            </p>
          </div>

          {/* Card Container for Reset Password Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                Set New Password
              </h2>
              <p className="text-slate-600 text-sm">
                Enter and confirm your new password.
              </p>
            </div>

            {(message || error) && (
              <div className={`mb-4 p-3 rounded-lg ${
                message 
                  ? "bg-green-50 border border-green-200 text-green-600" 
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}>
                <p className="text-sm">{message || error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg px-4 py-3 bg-white border border-slate-300 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Minimum 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-10 text-slate-500 hover:text-slate-700"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg px-4 py-3 bg-white border border-slate-300 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Repeat new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-slate-500 hover:text-slate-700"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? "Updating..." : (
                  <>
                    <FaKey />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </form>
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
              Secure Your Account
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Your security is our priority. Create a strong password to protect your admin dashboard and manage your tours safely.
            </p>
            <div className="mt-8 flex gap-8 justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold">🔒</p>
                <p className="text-white/80 text-sm mt-1">Encrypted</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">✓</p>
                <p className="text-white/80 text-sm mt-1">Verified</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">🛡️</p>
                <p className="text-white/80 text-sm mt-1">Protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}