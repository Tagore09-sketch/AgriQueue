import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CreditCard, CheckCircle2, Clock, AlertCircle, ArrowLeft, Receipt, ShieldCheck, Printer, Building2, Scale, RefreshCw } from 'lucide-react';
import { formatQuantity } from '../utils/quantity';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const bookingIdQuery = searchParams.get('bookingId');

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchPayment();
    // Auto-poll live payment status every 5 seconds
    const interval = setInterval(() => {
      fetchPayment(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [bookingIdQuery]);

  const fetchPayment = async (isBackground = false) => {
    let targetBookingId = bookingIdQuery;

    if (!targetBookingId) {
      try {
        const resBookings = await api.get('/bookings/my');
        if (resBookings.success && resBookings.bookings && resBookings.bookings.length > 0) {
          targetBookingId = resBookings.bookings[0].bookingId;
        } else {
          if (!isBackground) setLoading(false);
          setError('No booking found.');
          return;
        }
      } catch (err) {
        if (!isBackground) setLoading(false);
        setError('Failed to load bookings.');
        return;
      }
    }

    try {
      if (!isBackground) setLoading(true);
      const res = await api.get(`/payments/${targetBookingId}`);
      if (res.success) {
        if (res.payment) {
          setPayment(res.payment);
          setLastUpdated(new Date());
        } else {
          setInfoMsg(res.message || 'Payment record & official invoice will be generated once procurement is completed by officer.');
        }
      }
    } catch (err) {
      if (!isBackground) setError(err.message || 'Error fetching payment record.');
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    if (status === 'COMPLETED') return 3;
    if (status === 'PROCESSING') return 2;
    return 1;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Link & Actions */}
        <div className="flex justify-between items-center">
          <Link
            to="/farmer/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-agri-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          {payment && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchPayment()}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-agri-700" /> Refresh Live
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 bg-agri-700 hover:bg-agri-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print Invoice
              </button>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex p-3 bg-agri-100 text-agri-700 rounded-2xl mb-2">
            <Receipt className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Procurement Invoice & Payment</h2>
          <p className="text-sm text-gray-500 mt-1">Official APMC Mandi Procurement Settlement Slip & Real-Time Bank Disbursal</p>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-2xl text-center font-bold text-agri-700 animate-pulse border border-gray-200">
            Fetching Payment Invoice & Live Disbursal Status...
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-2xl border border-red-200 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        ) : infoMsg ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-4">
            <Clock className="w-12 h-12 text-amber-500 mx-auto animate-spin-slow" />
            <h3 className="text-lg font-bold text-gray-900">Payment Pending Inspection Completion</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">{infoMsg}</p>
          </div>
        ) : payment && (
          <div className="space-y-6">
            
            {/* Real-Time Disbursal Progress Banner */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Real-Time Payment Disbursal Status</span>
                  <span className="text-lg font-extrabold text-gray-900">
                    {payment.status === 'COMPLETED' ? '🎉 Payment Successfully Disbursed to Bank' :
                     payment.status === 'PROCESSING' ? '⚡ Treasury Processing (Bank UTR Generated)' :
                     '⏳ Awaiting Officer Payment Release'}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">
                  Live Sync: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>

              {/* Step Progress Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className={`p-2.5 rounded-xl text-center border text-xs font-bold ${
                  getStatusStep(payment.status) >= 1 ? 'bg-agri-100 border-agri-400 text-agri-900' : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}>
                  1. Verified
                </div>
                <div className={`p-2.5 rounded-xl text-center border text-xs font-bold ${
                  getStatusStep(payment.status) >= 2 ? 'bg-blue-100 border-blue-400 text-blue-900 animate-pulse' : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}>
                  2. Processing (24h SLA)
                </div>
                <div className={`p-2.5 rounded-xl text-center border text-xs font-bold ${
                  getStatusStep(payment.status) >= 3 ? 'bg-green-100 border-green-400 text-green-900' : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}>
                  3. Transferred
                </div>
              </div>

              {/* 24-Hour Bank Credit SLA & SMS Message Banner */}
              <div className="bg-blue-50/90 border border-blue-200 p-4 rounded-xl text-xs space-y-2 text-blue-950">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block text-sm text-blue-900">💬 SMS Notification Sent to +91 {payment.farmerMobile}:</span>
                    <p className="mt-1 leading-relaxed text-blue-900">
                      "Dear <strong>{payment.farmerName}</strong>, your APMC procurement payout of <strong>₹ {Number(payment.amount || payment.grossAmount).toLocaleString('en-IN')}</strong> (Bank Ref: <strong>{payment.transactionReference}</strong>) has been processed. 
                      <span className="font-bold underline ml-1">The amount will be credited to your registered bank account within 24 hours.</span>"
                    </p>
                  </div>
                </div>

                {/* Toll-Free Helpline Support Box */}
                <div className="mt-3 pt-3 border-t border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/80 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-blue-600 text-white rounded-lg font-mono font-bold text-xs">☎️</span>
                    <div>
                      <span className="font-bold text-gray-900 text-xs block">If amount is not credited within 24 hours:</span>
                      <span className="text-[11px] text-gray-600">Contact APMC Direct Toll-Free Payment Helpline</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <a
                      href="tel:18004251555"
                      className="inline-block font-mono font-extrabold text-sm text-blue-700 hover:text-blue-900 underline"
                    >
                      1800-425-1555 / 1800-180-1551
                    </a>
                    <span className="block text-[10px] text-gray-400 font-medium">Toll-Free • 24x7 Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Printable Official Mandi Invoice */}
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-gray-900" id="official-invoice">
              
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b-2 border-agri-700 gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-agri-900 tracking-tight">AGRIQUEUE APMC MANDI</h1>
                  <p className="text-xs text-gray-500 font-semibold">Agricultural Produce Market Committee Official Settlement Slip</p>
                </div>
                <div className="sm:text-right">
                  <div className="text-sm font-extrabold text-gray-900">INVOICE: {payment.invoiceNo || 'AQ-INV-2026-9041'}</div>
                  <div className="text-xs text-gray-500 font-medium">Booking Ref: {payment.bookingId}</div>
                  <div className="text-xs text-gray-500 font-medium">Date: {new Date(payment.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Farmer & Bank Grid */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                
                {/* Farmer Info */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">FARMER BENEFICIARY</span>
                  <div className="text-sm font-extrabold text-gray-900">{payment.farmerName}</div>
                  <div className="text-gray-600">Mobile: {payment.farmerMobile}</div>
                  <div className="text-gray-600">Aadhaar: XXXX-XXXX-{payment.farmerAadhaarLast4 || '9012'}</div>
                  <div className="text-gray-600">Mandi Yard: {payment.mandiName}</div>
                </div>

                {/* Bank Details */}
                <div className="space-y-1 sm:border-l sm:border-gray-200 sm:pl-6">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">REGISTERED BANK ACCOUNT (DBT)</span>
                  <div className="text-sm font-extrabold text-agri-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-agri-700" />
                    <span>{payment.bankName || 'State Bank of India'}</span>
                  </div>
                  <div className="text-gray-700">Account Number: <strong className="font-mono">••••••••{payment.accountNumber ? String(payment.accountNumber).slice(-4) : '1234'}</strong></div>
                  <div className="text-gray-700">IFSC Code: <strong className="font-mono text-agri-800">{payment.ifscCode || 'SBIN0004123'}</strong></div>
                  <div className="text-agri-700 font-semibold">Bank Transaction Ref: <span className="font-mono font-bold text-agri-800">{payment.transactionReference}</span></div>
                </div>

              </div>

              {/* Produce & Weighment Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-agri-50 text-agri-900 font-bold border-b border-agri-200">
                      <th className="py-2.5 px-3">Crop / Variety</th>
                      <th className="py-2.5 px-3 text-right">Brought Quantity</th>
                      <th className="py-2.5 px-3 text-right">Accepted Quantity</th>
                      <th className="py-2.5 px-3 text-right">Rate / Quintal</th>
                      <th className="py-2.5 px-3 text-right">Gross Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 font-medium">
                      <td className="py-3 px-3 font-bold text-gray-900">{payment.crop || 'Paddy'} ({payment.quality || 'Grade A'})</td>
                      <td className="py-3 px-3 text-right">{formatQuantity(payment.quantityBrought || payment.acceptedQuantity)}</td>
                      <td className="py-3 px-3 text-right font-bold text-agri-800">{formatQuantity(payment.acceptedQuantity)}</td>
                      <td className="py-3 px-3 text-right font-bold text-gray-900">₹ {(payment.pricePerKg * 100).toLocaleString('en-IN')} / Qtl</td>
                      <td className="py-3 px-3 text-right font-bold text-gray-900">₹ {(payment.grossAmount || (payment.acceptedQuantity * payment.pricePerKg)).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="flex justify-end pt-2">
                <div className="w-full sm:w-80 text-xs space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Gross Value:</span>
                    <span className="font-semibold">₹ {(payment.grossAmount || (payment.acceptedQuantity * payment.pricePerKg)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Mandi User Cess (1%):</span>
                    <span>- ₹ {(payment.mandiCess || ((payment.acceptedQuantity * payment.pricePerKg) * 0.01)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Weighbridge & Handling:</span>
                    <span>- ₹ {(payment.handlingFee || 250).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Unloading Labor Fee:</span>
                    <span>- ₹ {(payment.unloadingFee || 150).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t-2 border-gray-900 pt-2 flex justify-between items-center text-sm font-black text-agri-900">
                    <span>NET PAYABLE AMOUNT:</span>
                    <span className="text-base text-agri-700">₹ {Number(payment.amount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="pt-6 border-t border-dashed border-gray-300 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 gap-2">
                <div>Authorized APMC Procurement Yard Officer • System Generated Slip</div>
                <div className="font-bold text-gray-700">Farmer Signature / Bank Direct Transfer Certified</div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
