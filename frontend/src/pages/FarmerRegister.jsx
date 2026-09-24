import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { User, Phone, ShieldCheck, MapPin, Sprout, Building2, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';

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
      setError('Expected quantity must be a positive number.');
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
            message: 'Registration successful! Please login with your mobile number.',
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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-agri-100 text-agri-700 rounded-2xl mb-3">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Farmer Registration</h2>
          <p className="text-sm text-gray-500 mt-1">Register your profile and bank details for instant APMC procurement payments</p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-md">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Personal Details */}
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100 flex items-center gap-2">
                <User className="w-4 h-4 text-agri-700" /> Personal & Contact Details
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
                    className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
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
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
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
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
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
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
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
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Crop Details */}
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-agri-700" /> Crop & Land Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Crop Name *
                  </label>
                  <select
                    name="cropName"
                    value={formData.cropName}
                    onChange={handleChange}
                    className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
                  >
                    <option value="Paddy">Paddy</option>
                    <option value="Maize">Maize</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Wheat">Wheat</option>
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
                    className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Expected Qty (Kg) *
                  </label>
                  <input
                    type="number"
                    name="expectedQuantity"
                    value={formData.expectedQuantity}
                    onChange={handleChange}
                    placeholder="e.g. 2500"
                    required
                    className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Bank Details */}
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-agri-700" /> Bank Account Details (For Payment Disbursal)
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
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
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
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
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
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all uppercase"
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
                      className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-agri-700 hover:bg-agri-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
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
            <Link to="/farmer/login" className="font-bold text-agri-700 hover:underline">
              Farmer Login Here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
