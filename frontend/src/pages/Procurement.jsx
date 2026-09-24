import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ClipboardCheck, CheckCircle2, Clock, AlertCircle, ArrowLeft, Scale } from 'lucide-react';

export default function Procurement() {
  const [searchParams] = useSearchParams();
  const bookingIdQuery = searchParams.get('bookingId');

  const [procurement, setProcurement] = useState(null);
  const [procurementStatus, setProcurementStatus] = useState('BOOKED');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProcurement();
  }, [bookingIdQuery]);

  const fetchProcurement = async () => {
    let targetBookingId = bookingIdQuery;

    if (!targetBookingId) {
      try {
        const resBookings = await api.get('/bookings/my');
        if (resBookings.success && resBookings.bookings && resBookings.bookings.length > 0) {
          targetBookingId = resBookings.bookings[0].bookingId;
        } else {
          setLoading(false);
          setError('No active booking found.');
          return;
        }
      } catch (err) {
        setLoading(false);
        setError('Failed to fetch booking details.');
        return;
      }
    }

    try {
      setLoading(true);
      const res = await api.get(`/procurement/${targetBookingId}`);
      if (res.success) {
        setProcurement(res.procurement);
        setProcurementStatus(res.procurementStatus || 'BOOKED');
      }
    } catch (err) {
      setError(err.message || 'Error fetching procurement details.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      BOOKED: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      CHECKED_IN: 'bg-blue-100 text-blue-800 border-blue-300',
      WAITING: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      CALLED: 'bg-purple-100 text-purple-800 border-purple-300 animate-pulse',
      IN_PROGRESS: 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse',
      COMPLETED: 'bg-green-100 text-green-800 border-green-300',
      CANCELLED: 'bg-red-100 text-red-800 border-red-300',
      NO_SHOW: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Link */}
        <div>
          <Link
            to="/farmer/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-agri-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex p-3 bg-agri-100 text-agri-700 rounded-2xl mb-2">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Procurement Status</h2>
          <p className="text-sm text-gray-500 mt-1">Track crop inspection, weighment, and quality rating</p>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-2xl text-center font-bold text-agri-700 animate-pulse">
            Loading Procurement Status...
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-2xl border border-red-200 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Status Summary Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm text-center space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Current Procurement Phase</span>
              <div>
                <span className={`inline-block px-4 py-1.5 rounded-full text-base font-extrabold tracking-wide border ${getStatusBadge(procurementStatus)}`}>
                  {procurementStatus}
                </span>
              </div>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                {procurementStatus === 'COMPLETED' ? 'Crop weighment and quality inspection completed by procurement officer.' :
                 procurementStatus === 'IN_PROGRESS' ? 'Procurement officer is currently weighing and inspecting your crop.' :
                 procurementStatus === 'CALLED' ? 'Please proceed immediately to the procurement gate counter.' :
                 'Your booking is scheduled in the APMC queue.'}
              </p>
            </div>

            {/* Detailed Inspection Card if Completed */}
            {procurement && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Scale className="w-5 h-5 text-agri-700" />
                  <span>Official Weighment & Inspection Sheet</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 font-semibold block uppercase">Procurement ID</span>
                    <span className="font-extrabold text-gray-900">{procurement.procurementId}</span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 font-semibold block uppercase">Crop Variety</span>
                    <span className="font-bold text-gray-900">{procurement.crop}</span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 font-semibold block uppercase">Quality Grade</span>
                    <span className="font-bold text-agri-700">{procurement.quality}</span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 font-semibold block uppercase">Quantity Brought</span>
                    <span className="font-semibold text-gray-800">{procurement.quantityBrought} Kg</span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 font-semibold block uppercase">Accepted Quantity</span>
                    <span className="font-extrabold text-agri-800">{procurement.acceptedQuantity} Kg</span>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 font-semibold block uppercase">Rate per Kg</span>
                    <span className="font-semibold text-gray-800">₹ {procurement.pricePerKg} / Kg</span>
                  </div>
                </div>

                <div className="bg-agri-50 border border-agri-200 p-5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-agri-800 font-bold block uppercase">Calculated Total Amount</span>
                    <span className="text-2xl font-extrabold text-agri-800">
                      ₹ {Number(procurement.totalAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Link
                    to={`/farmer/payment?bookingId=${procurement.bookingId}`}
                    className="bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all"
                  >
                    Check Payment Status
                  </Link>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
