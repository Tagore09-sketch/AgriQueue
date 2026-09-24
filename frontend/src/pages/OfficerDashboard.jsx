import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ShieldCheck, Megaphone, CheckCircle2, Clock, Scale, CreditCard, LogOut, RefreshCw, AlertCircle, X, ChevronRight, UserCheck, Receipt, Building2, Printer } from 'lucide-react';

export default function OfficerDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBookings: 0,
    waitingCount: 0,
    calledCount: 0,
    completedCount: 0,
    pendingPaymentsCount: 0
  });

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Currently Called Banner
  const [calledFarmer, setCalledFarmer] = useState(null);

  // Procurement Form Modal
  const [activeProcurementBooking, setActiveProcurementBooking] = useState(null);
  const [procurementForm, setProcurementForm] = useState({
    quantityBrought: '',
    acceptedQuantity: '',
    quality: 'Grade A',
    pricePerKg: '25',
    remarks: 'Produce verified & weighed'
  });

  // Payment / Invoice update modal
  const [activePaymentInvoice, setActivePaymentInvoice] = useState(null);
  const [paymentStatusSelect, setPaymentStatusSelect] = useState('PROCESSING');

  useEffect(() => {
    fetchOfficerData();
  }, []);

  const fetchOfficerData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/queue/officer/list');
      if (res.success) {
        setStats(res.stats);
        setQueue(res.queue || []);
        
        // Find called farmer if any
        const currentCalled = (res.queue || []).find(b => b.status === 'CALLED');
        if (currentCalled) {
          setCalledFarmer({
            tokenNumber: currentCalled.tokenNumber,
            farmerName: currentCalled.farmerName,
            crop: currentCalled.crop,
            bookingId: currentCalled.bookingId
          });
        }
      }
    } catch (err) {
      setError(err.message || 'Error loading officer queue data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agriqueue_token');
    localStorage.removeItem('agriqueue_role');
    localStorage.removeItem('agriqueue_user_name');
    navigate('/');
  };

  // 1. Check In Farmer (BOOKED -> CHECKED_IN -> WAITING)
  const handleCheckIn = async (bookingId) => {
    try {
      const res = await api.post(`/queue/check-in/${bookingId}`);
      if (res.success) {
        setActionMsg(`✅ Check-in successful for ${bookingId}`);
        fetchOfficerData();
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Check-in failed');
    }
  };

  // 2. Call Next Farmer Button
  const handleCallNext = async () => {
    try {
      const res = await api.post('/queue/call-next');
      if (res.success && res.calledFarmer) {
        setCalledFarmer(res.calledFarmer);
        setActionMsg(`📢 Now Calling Token ${res.calledFarmer.tokenNumber} (${res.calledFarmer.farmerName})`);
        fetchOfficerData();
        setTimeout(() => setActionMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'No waiting farmers to call.');
    }
  };

  // 3. Start Procurement (CALLED -> IN_PROGRESS) & Open Form
  const handleStartProcurement = async (booking) => {
    try {
      await api.put(`/procurement/${booking.bookingId}`, { status: 'IN_PROGRESS' });
      setActiveProcurementBooking(booking);
      setProcurementForm({
        quantityBrought: String(booking.quantity || 2500),
        acceptedQuantity: String(booking.quantity || 2500),
        quality: 'Grade A',
        pricePerKg: '25',
        remarks: 'Produce verified & weighed'
      });
      fetchOfficerData();
    } catch (err) {
      alert(err.message || 'Failed to start procurement');
    }
  };

  // 4. Submit Procurement Form (IN_PROGRESS -> COMPLETED, Payment -> PENDING)
  const handleSubmitProcurement = async (e) => {
    e.preventDefault();
    if (!activeProcurementBooking) return;

    try {
      const res = await api.post('/procurement', {
        bookingId: activeProcurementBooking.bookingId,
        quantityBrought: parseFloat(procurementForm.quantityBrought),
        acceptedQuantity: parseFloat(procurementForm.acceptedQuantity),
        quality: procurementForm.quality,
        pricePerKg: parseFloat(procurementForm.pricePerKg),
        remarks: procurementForm.remarks
      });

      if (res.success) {
        setActionMsg(`🎉 Procurement completed for ${activeProcurementBooking.bookingId}! Payment invoice generated.`);
        setActiveProcurementBooking(null);
        fetchOfficerData();
        setTimeout(() => setActionMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to complete procurement');
    }
  };

  // Open Payment & Official Invoice Modal for Officer
  const handleOpenPaymentInvoiceModal = async (booking) => {
    try {
      const res = await api.get(`/payments/${booking.bookingId}`);
      if (res.success && res.payment) {
        setActivePaymentInvoice(res.payment);
        setPaymentStatusSelect(res.payment.status);
      } else {
        alert('Payment invoice record not generated yet. Complete procurement first.');
      }
    } catch (err) {
      alert('Error fetching invoice details: ' + err.message);
    }
  };

  // 5. Update Payment Disbursal Status (PENDING -> PROCESSING -> COMPLETED)
  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    if (!activePaymentInvoice) return;

    try {
      const res = await api.put(`/payments/${activePaymentInvoice.bookingId}`, {
        status: paymentStatusSelect
      });

      if (res.success) {
        setActionMsg(`💳 Payment status for ${activePaymentInvoice.bookingId} updated to ${paymentStatusSelect}!`);
        setActivePaymentInvoice(null);
        fetchOfficerData();
        setTimeout(() => setActionMsg(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update payment status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center font-bold text-gray-900 animate-pulse text-lg">
        Loading Officer Queue Console...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-agri-900 border border-agri-700 text-agri-300 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <ShieldCheck className="w-4 h-4 text-agri-400" /> APMC Officer Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Procurement Officer Dashboard
            </h1>
            <p className="text-sm text-gray-400">Manage queue check-ins, call farmers, inspect produce, and disburse bank payments</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOfficerData}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs py-2.5 px-3.5 rounded-xl border border-gray-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-agri-400" /> Refresh Queue
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-300 font-bold text-xs py-2.5 px-3.5 rounded-xl border border-red-500/30 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="bg-agri-100 border border-agri-300 text-agri-900 p-4 rounded-xl text-sm font-bold shadow-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-agri-700 flex-shrink-0" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Large Prominent CALL NEXT FARMER Action Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-agri-500 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-50 border border-agri-200 px-3 py-1 rounded-full">
              Live Queue Control
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2">
              Ready for Next Farmer Procurement?
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Clicking <strong className="text-gray-900">CALL NEXT FARMER</strong> selects the first waiting farmer and notifies their live dashboard.
            </p>
          </div>

          <button
            onClick={handleCallNext}
            className="w-full md:w-auto bg-agri-700 hover:bg-agri-800 text-white font-black text-lg py-4 px-8 rounded-2xl shadow-lg shadow-agri-700/30 transition-all hover:scale-105 flex items-center justify-center gap-3"
          >
            <Megaphone className="w-6 h-6" />
            <span>CALL NEXT FARMER</span>
          </button>
        </div>

        {/* Currently Called Banner */}
        {calledFarmer && (
          <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-lg border border-blue-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Megaphone className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-blue-200 block">Now Calling Farmer</span>
                <span className="text-2xl font-extrabold font-mono text-white">Token: {calledFarmer.tokenNumber}</span>
                <span className="text-sm text-blue-200 ml-3">({calledFarmer.farmerName} - {calledFarmer.crop})</span>
              </div>
            </div>

            <button
              onClick={() => handleStartProcurement({ bookingId: calledFarmer.bookingId, crop: calledFarmer.crop })}
              className="bg-white hover:bg-blue-50 text-blue-900 font-extrabold text-sm py-3 px-5 rounded-xl shadow-md transition-all"
            >
              Start Procurement Form
            </button>
          </div>
        )}

        {/* Five Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs font-bold text-gray-400 uppercase block">Total Bookings</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-1 block">{stats.totalBookings}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs font-bold text-gray-400 uppercase block">Waiting Queue</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{stats.waitingCount}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs font-bold text-gray-400 uppercase block">Called Tokens</span>
            <span className="text-2xl font-extrabold text-blue-600 mt-1 block">{stats.calledCount}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs font-bold text-gray-400 uppercase block">Completed</span>
            <span className="text-2xl font-extrabold text-agri-700 mt-1 block">{stats.completedCount}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm col-span-2 lg:col-span-1">
            <span className="text-xs font-bold text-gray-400 uppercase block">Pending Payments</span>
            <span className="text-2xl font-extrabold text-purple-600 mt-1 block">{stats.pendingPaymentsCount}</span>
          </div>
        </div>

        {/* Queue Management Table */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Live Procurement Queue Table</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase bg-gray-50">
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Farmer Details</th>
                  <th className="py-3 px-4">Crop & Qty</th>
                  <th className="py-3 px-4">Slot Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Officer Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {queue.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No bookings in queue today.
                    </td>
                  </tr>
                ) : (
                  queue.map(row => (
                    <tr key={row.bookingId} className="hover:bg-gray-50">
                      
                      <td className="py-3.5 px-4 font-mono font-bold text-agri-800">
                        {row.tokenNumber}
                        <div className="text-[11px] text-gray-400 font-sans">{row.bookingId}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{row.farmerName}</div>
                        <div className="text-xs text-gray-500">{row.farmerMobile}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-800">{row.crop}</div>
                        <div className="text-xs text-gray-500">{row.quantity} Kg</div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-gray-700">
                        <div>{row.date}</div>
                        <div className="font-mono text-gray-500">{row.timeSlot}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          row.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          row.status === 'CALLED' ? 'bg-blue-100 text-blue-800 font-extrabold' :
                          row.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* 1. Check In */}
                          {row.status === 'BOOKED' && (
                            <button
                              onClick={() => handleCheckIn(row.bookingId)}
                              className="bg-agri-50 hover:bg-agri-100 text-agri-800 border border-agri-300 font-bold text-xs py-1.5 px-3 rounded-lg transition-all"
                            >
                              Check In
                            </button>
                          )}

                          {/* 2. Call */}
                          {(row.status === 'WAITING' || row.status === 'CHECKED_IN') && (
                            <button
                              onClick={async () => {
                                await api.put(`/procurement/${row.bookingId}`, { status: 'CALLED' });
                                setCalledFarmer({
                                  tokenNumber: row.tokenNumber,
                                  farmerName: row.farmerName,
                                  crop: row.crop,
                                  bookingId: row.bookingId
                                });
                                fetchOfficerData();
                              }}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold text-xs py-1.5 px-3 rounded-lg transition-all"
                            >
                              Call
                            </button>
                          )}

                          {/* 3. Start Procurement */}
                          {row.status === 'CALLED' && (
                            <button
                              onClick={() => handleStartProcurement(row)}
                              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-all"
                            >
                              Start Procurement
                            </button>
                          )}

                          {/* 4. Complete Procurement Form */}
                          {row.status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => {
                                setActiveProcurementBooking(row);
                                setProcurementForm({
                                  quantityBrought: String(row.quantity || 2500),
                                  acceptedQuantity: String(row.quantity || 2500),
                                  quality: 'Grade A',
                                  pricePerKg: '25',
                                  remarks: 'Produce verified & weighed'
                                });
                              }}
                              className="bg-green-700 hover:bg-green-800 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-all"
                            >
                              Complete Form
                            </button>
                          )}

                          {/* 5. View Invoice & Update Payment */}
                          {row.status === 'COMPLETED' && (
                            <button
                              onClick={() => handleOpenPaymentInvoiceModal(row)}
                              className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 font-bold text-xs py-1.5 px-3 rounded-lg transition-all flex items-center gap-1"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>View Invoice / Disburse</span>
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PROCUREMENT FORM MODAL */}
        {activeProcurementBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
              <button
                onClick={() => setActiveProcurementBooking(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="bg-agri-100 text-agri-700 p-2 rounded-xl">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Procurement Inspection Form</h3>
                  <p className="text-xs text-gray-500">Token: {activeProcurementBooking.tokenNumber} ({activeProcurementBooking.farmerName})</p>
                </div>
              </div>

              <form onSubmit={handleSubmitProcurement} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Quantity Brought (Kg) *
                  </label>
                  <input
                    type="number"
                    value={procurementForm.quantityBrought}
                    onChange={(e) => setProcurementForm({ ...procurementForm, quantityBrought: e.target.value })}
                    required
                    className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Accepted Quantity (Kg) *
                  </label>
                  <input
                    type="number"
                    value={procurementForm.acceptedQuantity}
                    onChange={(e) => setProcurementForm({ ...procurementForm, acceptedQuantity: e.target.value })}
                    required
                    className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Quality / Grade *
                    </label>
                    <select
                      value={procurementForm.quality}
                      onChange={(e) => setProcurementForm({ ...procurementForm, quality: e.target.value })}
                      className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900"
                    >
                      <option value="Grade A">Grade A (Premium)</option>
                      <option value="Grade B">Grade B (Standard)</option>
                      <option value="Grade C">Grade C (Fair)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Price per Kg (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={procurementForm.pricePerKg}
                      onChange={(e) => setProcurementForm({ ...procurementForm, pricePerKg: e.target.value })}
                      required
                      className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Remarks / Inspection Notes
                  </label>
                  <input
                    type="text"
                    value={procurementForm.remarks}
                    onChange={(e) => setProcurementForm({ ...procurementForm, remarks: e.target.value })}
                    className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900"
                  />
                </div>

                <div className="bg-agri-50 border border-agri-200 p-4 rounded-xl flex items-center justify-between text-sm">
                  <span className="font-bold text-agri-900">Gross Total Amount:</span>
                  <span className="font-extrabold text-agri-800 text-lg">
                    ₹ {(parseFloat(procurementForm.acceptedQuantity || 0) * parseFloat(procurementForm.pricePerKg || 0)).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-agri-700 hover:bg-agri-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all"
                >
                  Complete Procurement & Generate Payment Invoice
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PAYMENT INVOICE & DISBURSAL MODAL FOR OFFICER */}
        {activePaymentInvoice && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-8">
              <button
                onClick={() => setActivePaymentInvoice(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="bg-purple-100 text-purple-700 p-2.5 rounded-xl">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">Official Mandi Invoice & Bank Disbursal</h3>
                  <p className="text-xs text-gray-500">Booking: {activePaymentInvoice.bookingId} ({activePaymentInvoice.farmerName})</p>
                </div>
              </div>

              {/* Invoice Breakdown */}
              <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="font-extrabold text-gray-900">Invoice No: {activePaymentInvoice.invoiceNo}</span>
                  <span className="font-mono text-agri-800 font-bold">Bank UTR: {activePaymentInvoice.transactionReference}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 font-bold block uppercase text-[10px]">FARMER BENEFICIARY</span>
                    <div className="font-bold text-gray-900 text-sm">{activePaymentInvoice.farmerName}</div>
                    <div className="text-gray-600">{activePaymentInvoice.farmerMobile}</div>
                  </div>

                  <div>
                    <span className="text-gray-400 font-bold block uppercase text-[10px]">REGISTERED BANK ACCOUNT</span>
                    <div className="font-bold text-agri-900">{activePaymentInvoice.bankName || 'State Bank of India'}</div>
                    <div className="text-gray-700 font-mono">A/C: ••••••••{activePaymentInvoice.accountNumber ? String(activePaymentInvoice.accountNumber).slice(-4) : '1234'} | IFSC: {activePaymentInvoice.ifscCode}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-2">
                  <div>Crop Procured: <strong>{activePaymentInvoice.crop} ({activePaymentInvoice.acceptedQuantity} Kg)</strong></div>
                  <div>Rate per Kg: <strong>₹ {activePaymentInvoice.pricePerKg}</strong></div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Gross Amount:</span>
                    <span>₹ {(activePaymentInvoice.grossAmount || (activePaymentInvoice.acceptedQuantity * activePaymentInvoice.pricePerKg)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Mandi User Cess (1%):</span>
                    <span>- ₹ {(activePaymentInvoice.mandiCess || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Handling & Unloading Fees:</span>
                    <span>- ₹ 400.00</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-agri-900 pt-1 border-t border-gray-200">
                    <span>NET DISBURSED TO FARMER:</span>
                    <span className="text-agri-700">₹ {Number(activePaymentInvoice.amount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Payment Status Disbursal Form */}
              <form onSubmit={handleUpdatePayment} className="space-y-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Update Officer Disbursal Status *
                  </label>
                  <select
                    value={paymentStatusSelect}
                    onChange={(e) => setPaymentStatusSelect(e.target.value)}
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900"
                  >
                    <option value="PENDING">PENDING (Verified, Awaiting Fund Disbursal)</option>
                    <option value="PROCESSING">PROCESSING (Bank Transfer Sent)</option>
                    <option value="COMPLETED">COMPLETED (Funds Transferred to Farmer A/C)</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> Print Invoice
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-xl shadow-md text-sm transition-all"
                  >
                    Save & Update Disbursal Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
