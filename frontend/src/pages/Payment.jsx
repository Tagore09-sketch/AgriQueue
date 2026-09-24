import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CreditCard, CheckCircle2, Clock, AlertCircle, ArrowLeft, Receipt, ShieldCheck, Printer, Building2, Download } from 'lucide-react';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const bookingIdQuery = searchParams.get('bookingId');

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  useEffect(() => {
    fetchPayment();
  }, [bookingIdQuery]);

  const fetchPayment = async () => {
    let targetBookingId = bookingIdQuery;

    if (!targetBookingId) {
      try {
        const resBookings = await api.get('/bookings/my');
        if (resBookings.success && resBookings.bookings && resBookings.bookings.length > 0) {
          targetBookingId = resBookings.bookings[0].bookingId;
        } else {
          setLoading(false);
          setError('No booking found.');
          return;
        }
      } catch (err) {
        setLoading(false);
        setError('Failed to load bookings.');
        return;
      }
    }

    try {
      setLoading(true);
      const res = await api.get(`/payments/${targetBookingId}`);
      if (res.success) {
        if (res.payment) {
          setPayment(res.payment);
        } else {
          setInfoMsg(res.message || 'Payment record & official invoice will be generated once procurement is completed by officer.');
        }
      }
    } catch (err) {
      setError(err.message || 'Error fetching payment record.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'COMPLETED') return 'bg-green-100 text-green-800 border-green-300';
    if (status === 'PROCESSING') return 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse';
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Link */}
        <div className="flex justify-between items-center">
          <Link
            to="/farmer/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-agri-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          {payment && (
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-700 shadow-sm"
            >
              <Printer className="w-4 h-4 text-agri-700" /> Print Invoice
            </button>
          )}
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex p-3 bg-agri-100 text-agri-700 rounded-2xl mb-2">
            <Receipt className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Procurement Invoice & Payment</h2>
          <p className="text-sm text-gray-500 mt-1">Official APMC Mandi Procurement Settlement Slip & Bank Disbursal</p>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-2xl text-center font-bold text-agri-700 animate-pulse">
            Loading Payment Invoice...
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-2xl border border-red-200 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        ) : infoMsg ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center space-y-4">
            <Clock className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">Payment Pending Procurement Completion</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">{infoMsg}</p>
          </div>
        ) : payment && (
          <div className="space-y-6">
            
            {/* Disbursal Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm text-center space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Disbursal Status</span>
              <div>
                <span className={`inline-block px-4 py-1.5 rounded-full text-base font-extrabold tracking-wide border ${getStatusBadge(payment.status)}`}>
                  STATUS: {payment.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                {payment.status === 'COMPLETED' ? 'Funds successfully transferred to your registered bank account.' :
                 payment.status === 'PROCESSING' ? 'Payment is currently processing with the APMC treasury bank.' :
                 'Procurement record verified. Awaiting officer payment release.'}
              </p>
            </div>

            {/* Printable Official Mandi Invoice */}
            <div className="bg-white border-2 border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-gray-900" id="official-invoice">
              
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
                  <div className="text-agri-700 font-semibold">Bank UTR Ref: <span className="font-mono font-bold">{payment.transactionReference}</span></div>
                </div>

              </div>

              {/* Produce & Weighment Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-agri-50 text-agri-900 font-bold border-b border-agri-200">
                      <th className="py-2.5 px-3">Crop / Variety</th>
                      <th className="py-2.5 px-3 text-right">Brought Qty</th>
                      <th className="py-2.5 px-3 text-right">Accepted Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate / Kg</th>
                      <th className="py-2.5 px-3 text-right">Gross Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 font-medium">
                      <td className="py-3 px-3 font-bold text-gray-900">{payment.crop} ({payment.quality || 'Grade A'})</td>
                      <td className="py-3 px-3 text-right">{payment.quantityBrought || payment.acceptedQuantity} Kg</td>
                      <td className="py-3 px-3 text-right font-bold text-agri-800">{payment.acceptedQuantity} Kg ({(payment.acceptedQuantity/100).toFixed(2)} Qtl)</td>
                      <td className="py-3 px-3 text-right">₹ {payment.pricePerKg}</td>
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
                    <span>NET PAYABLE TO FARMER:</span>
                    <span className="text-base text-agri-700">₹ {Number(payment.amount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="pt-6 border-t border-dashed border-gray-300 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 gap-2">
                <div>Authorized APMC Procurement Yard Officer • System Generated</div>
                <div className="font-bold text-gray-700">Farmer Signature / Bank A/C Credit Certified</div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
