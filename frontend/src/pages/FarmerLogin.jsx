import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Phone, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FarmerLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobile, setMobile] = useState(location.state?.mobile || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/send-otp', { mobile });
      if (res.success) {
        navigate('/farmer/otp-verify', {
          state: {
            mobile,
            otp: res.otp
          }
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Ensure mobile is registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Farmer Login</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your registered 10-digit mobile number</p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-md">
          {successMsg && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-3.5 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Registered Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-agri-700 hover:bg-agri-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Sending OTP...</span>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have a registered account?{' '}
            <Link to="/farmer/register" className="font-bold text-agri-700 hover:underline">
              Register Here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
