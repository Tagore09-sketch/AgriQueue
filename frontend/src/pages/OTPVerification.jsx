import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Lock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const mobile = location.state?.mobile || '';
  const generatedOtp = location.state?.otp || '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/verify-otp', { mobile, otp });
      if (res.success && res.token) {
        localStorage.setItem('agriqueue_token', res.token);
        localStorage.setItem('agriqueue_role', res.user.role);
        localStorage.setItem('agriqueue_user_name', res.user.name);

        if (res.user.role === 'officer') {
          navigate('/officer/dashboard');
        } else {
          navigate('/farmer/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-agri-100 text-agri-700 rounded-2xl mb-3">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Enter OTP</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sent to mobile <span className="font-bold text-gray-800">{mobile || 'your number'}</span>
          </p>
        </div>

        {/* Dynamic OTP Notification Banner */}
        {generatedOtp && (
          <div className="mb-6 bg-agri-50 border border-agri-200 text-agri-800 p-4 rounded-xl text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-5 h-5 text-agri-700 flex-shrink-0" />
              <span>OTP Sent to Mobile:</span>
            </div>
            <div className="bg-agri-700 text-white font-mono font-bold text-base px-3 py-1 rounded-md">
              {generatedOtp}
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-md">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 text-center">
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="------"
                required
                className="block w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-xl text-center font-mono font-bold text-2xl tracking-widest text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-agri-700 hover:bg-agri-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Verifying OTP...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Verify OTP & Login</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
