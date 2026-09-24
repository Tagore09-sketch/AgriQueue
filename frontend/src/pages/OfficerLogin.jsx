import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ShieldCheck, Phone, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function OfficerLogin() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState('9000000000');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Enter Mobile, 2 = Enter OTP
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!mobile) {
      setError('Please enter your officer mobile number.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/send-otp', { mobile });
      if (res.success) {
        setGeneratedOtp(res.otp || '123456');
        setOtp(res.otp || '123456'); // Pre-fill with generated OTP for fast testing
        setStep(2);
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/verify-otp', { mobile, otp });
      if (res.success && res.token) {
        if (res.user.role !== 'officer') {
          setError('Access Denied: This account is registered as a Farmer, not an Officer.');
          return;
        }

        localStorage.setItem('agriqueue_token', res.token);
        localStorage.setItem('agriqueue_role', 'officer');
        localStorage.setItem('agriqueue_user_name', res.user.name || 'Procurement Officer');

        navigate('/officer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Officer OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gray-900 text-white rounded-2xl mb-3 shadow-md">
            <ShieldCheck className="w-8 h-8 text-agri-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Procurement Officer Portal</h2>
          <p className="text-sm text-gray-500 mt-1">Authorized APMC Mandi Staff Login</p>
        </div>

        {/* Dynamic OTP Notification Banner on Step 2 */}
        {step === 2 && generatedOtp && (
          <div className="mb-6 bg-agri-50 border border-agri-200 text-agri-900 p-4 rounded-xl text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-5 h-5 text-agri-700 flex-shrink-0" />
              <span>Officer OTP:</span>
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

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Officer Mobile Number
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
                    placeholder="9000000000"
                    required
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Send Officer OTP</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 text-center">
                  Enter 6-Digit Officer OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    required
                    className="block w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-xl text-center font-mono font-bold text-2xl tracking-widest text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all"
                  />
                </div>
                <p className="text-[11px] text-gray-500 text-center mt-2">
                  Enter the 6-digit OTP displayed above or type your 6-digit OTP.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-agri-700 hover:bg-agri-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Verifying Officer...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Verify & Open Officer Console</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
