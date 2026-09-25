import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { User, Phone, ShieldCheck, MapPin, Sprout, Building2, CreditCard, AlertCircle, CheckCircle2, Scale } from 'lucide-react';
import { kgToQtl, qtlToKg } from '../utils/quantity';

export default function FarmerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    aadhaar: '',
    village: '',
    district: '',
    cropName: 'Paddy',
    landArea: '',
    expectedQuantityQtl: '',
    expectedQuantity: '',
    bankName: 'State Bank of India',
    accountNumber: '',
    ifscCode: '',
    upiId: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleQtlChange = (e) => {
    const qtlVal = e.target.value;
    const computedKg = qtlToKg(qtlVal);
    setFormData(prev => ({
      ...prev,
      expectedQuantityQtl: qtlVal,
      expectedQuantity: String(computedKg)
    }));
    setError('');
  };

  const handleKgChange = (e) => {
    const kgVal = e.target.value;
    const computedQtl = kgToQtl(kgVal);
    setFormData(prev => ({
      ...prev,
      expectedQuantity: kgVal,
      expectedQuantityQtl: computedQtl
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Aadhaar Validation: Exactly 12 digits, numbers only
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(formData.aadhaar)) {
      setError('Aadhaar number must be exactly 12 numeric digits.');
      return;
    }

    // Mobile Validation: 10 digits starting with 6-9
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    // Land Area validation
    if (parseFloat(formData.landArea) <= 0) {
      setError('Land area must be a positive number.');
      return;
    }

    // Expected Quantity validation
    if (parseFloat(formData.expectedQuantity) <= 0) {
      setError('Expected quantity must be a positive number in Quintals or Kg.');
      return;
    }

    if (!formData.bankName || !formData.accountNumber || !formData.ifscCode) {
      setError('Please provide your complete Bank details for direct payment transfer.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/register', formData);
      if (res.success) {
        navigate('/farmer/login', { 
          state: { 
            message: `Registration successful! Welcome SMS dispatched to +91 ${formData.mobile}. Please login.`,
            mobile: formData.mobile 
          } 
        });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-emerald-950 via-gray-900 to-amber-950 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Image Ambient Overlay */}
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
        <img
          src="/farmer_register_bg.jpg"
          alt="Harvest Field Background"
          className="w-full h-full object-cover filter brightness-75"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT SIDE: Farmer Registration Form */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-400/30 mb-3">
              <Sprout className="w-4 h-4 text-amber-400" />
              <span>Official APMC Farmer Registration Portal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Farmer Registration</h2>
            <p className="text-sm text-emerald-200/90 mt-1">Register your profile and bank details for APMC crop procurement</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-emerald-400/30 shadow-2xl">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section 1: Personal Details */}
              <div>
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-700" /> Personal & Contact Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ravi Kumar"
                      required
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        maxLength={10}
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="9876543210"
                        required
                        className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Aadhaar Number (12 Digits) *
                      </label>
                      <input
                        type="text"
                        name="aadhaar"
                        maxLength={12}
                        value={formData.aadhaar}
                        onChange={handleChange}
                        placeholder="123456789012"
                        required
                        className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Village *
                      </label>
                      <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        placeholder="e.g. Vadlamudi"
                        required
                        className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        District *
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="e.g. Guntur"
                        required
                        className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Crop & Quantity in Quintals */}
              <div>
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-700" /> Crop & Land Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Crop Type
                      </label>
                      <span className="text-[10px] font-bold px-1 bg-gray-200 text-gray-600 rounded">Optional</span>
                    </div>
                    <select
                      name="cropName"
                      value={formData.cropName}
                      onChange={handleChange}
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    >
                      <option value="Paddy">Paddy</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Maize">Maize</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Pulses">Pulses</option>
                      <option value="General Produce / Paddy">General Produce / Not Specified</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Land Area (Acres) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="landArea"
                      value={formData.landArea}
                      onChange={handleChange}
                      placeholder="e.g. 3.5"
                      required
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Expected Qty (Quintals) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        name="expectedQuantityQtl"
                        value={formData.expectedQuantityQtl}
                        onChange={handleQtlChange}
                        placeholder="e.g. 25"
                        required
                        className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                      <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">Qtl</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Bank Details */}
              <div>
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700" /> Bank Account Details (For 24h Payment Disbursal)
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="State Bank of India"
                        required
                        className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="98765432101234"
                        required
                        className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        placeholder="SBIN0004123"
                        required
                        className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        UPI ID (Optional)
                      </label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleChange}
                        placeholder="ravikumar@upi"
                        className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-emerald-700/40 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Registering Profile...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Register Profile & Bank Details</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already registered?{' '}
              <Link to="/farmer/login" className="font-bold text-emerald-700 hover:underline">
                Farmer Login Here
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Farmer Image + Logo Showcase Card */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between relative rounded-2xl overflow-hidden border border-amber-400/40 shadow-2xl bg-gray-900 min-h-[600px] group">
          
          {/* Background Farmer Image */}
          <img
            src="/farmer_register_bg.jpg"
            alt="APMC Farmer"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

          {/* Top Logo Emblem Overlay */}
          <div className="relative z-10 p-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-3 bg-gray-950/90 backdrop-blur-md border border-amber-400/60 p-2.5 pr-5 rounded-2xl shadow-xl">
              <img
                src="/farmer_logo.png"
                alt="AgriQueue Emblem"
                className="w-12 h-12 object-contain bg-gray-900 rounded-xl p-0.5 border border-amber-400 shadow-md"
              />
              <div>
                <span className="text-xl font-black text-white tracking-tight block">AgriQueue</span>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Farmer Direct Portal</span>
              </div>
            </div>

            <span className="bg-emerald-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-400/40 backdrop-blur-md shadow-lg">
              🌾 APMC Direct
            </span>
          </div>

          {/* Bottom Card Highlights */}
          <div className="relative z-10 p-6 bg-gradient-to-t from-emerald-950 via-emerald-950/95 to-transparent pt-16">
            <h3 className="text-xl font-black text-white mb-2 leading-snug">
              Guaranteed APMC Queue & 24-Hour Bank Credit
            </h3>
            <p className="text-xs text-emerald-200/90 leading-relaxed mb-4">
              Book slots effortlessly, avoid endless waiting lines, and receive direct payments to your bank account with complete weighment transparency in Quintals & Kgs.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-800/80">
              <div className="bg-emerald-900/70 backdrop-blur-md p-3 rounded-xl border border-emerald-500/30">
                <span className="text-amber-300 text-xs font-extrabold block">Confidential OTP</span>
                <span className="text-[11px] text-emerald-200">Manual 6-digit entry</span>
              </div>
              <div className="bg-emerald-900/70 backdrop-blur-md p-3 rounded-xl border border-emerald-500/30">
                <span className="text-amber-300 text-xs font-extrabold block">Toll-Free Support</span>
                <span className="text-[11px] text-emerald-200">1800-425-1555</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
