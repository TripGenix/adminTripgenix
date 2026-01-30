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
      setMessage("Password reset link has been sent.");
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">TripGenix Admin</h1>
            <p className="text-slate-600 text-sm">
              Manage tours, bookings and users from a single dashboard.
            </p>
          </div>

          {/* Card Container for Forgot Password Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                Reset Password
              </h2>
              <p className="text-slate-600 text-sm">
                Enter your admin email address to receive a password reset link.
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? "Sending..." : (
                  <>
                    <FaPaperPlane />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-sm text-slate-600 mt-6">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Back to Sign In
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
              We've Got You Covered
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Don't worry! Resetting your password is easy. Just enter your email and we'll send you a link to get back on track with managing your tours.
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}