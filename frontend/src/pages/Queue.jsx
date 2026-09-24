import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Ticket, Clock, Users, RefreshCw, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function Queue() {
  const [searchParams] = useSearchParams();
  const bookingIdQuery = searchParams.get('bookingId');

  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchQueue = async () => {
    if (!bookingIdQuery) {
      // Fetch latest booking if no query provided
      try {
        const resBookings = await api.get('/bookings/my');
        if (resBookings.success && resBookings.bookings && resBookings.bookings.length > 0) {
          const latestBooking = resBookings.bookings[0];
          loadBookingQueue(latestBooking.bookingId);
        } else {
          setLoading(false);
          setError('No active booking found. Please book a procurement slot first.');
        }
      } catch (err) {
        setLoading(false);
        setError('Failed to load queue details.');
      }
      return;
    }

    loadBookingQueue(bookingIdQuery);
  };

  const loadBookingQueue = async (bId) => {
    try {
      const res = await api.get(`/queue/${bId}`);
      if (res.success && res.queueStatus) {
        setQueueData(res.queueStatus);
        setLastRefreshed(new Date());
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Error loading live queue status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    // Simple periodic polling every 10 seconds (No WebSockets)
    const interval = setInterval(() => {
      fetchQueue();
    }, 10000);
    return () => clearInterval(interval);
  }, [bookingIdQuery]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/farmer/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-agri-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <button
            onClick={fetchQueue}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm text-gray-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-agri-700" />
            <span>Refreshed: {lastRefreshed.toLocaleTimeString()}</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex p-3 bg-agri-100 text-agri-700 rounded-2xl mb-2">
            <Ticket className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Live Procurement Queue</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time token position and waiting time estimation</p>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-2xl text-center font-bold text-agri-700 animate-pulse">
            Loading Live Queue Status...
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-2xl border border-red-200 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <Link
              to="/farmer/book-slot"
              className="inline-block bg-agri-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-agri-800"
            >
              Book a Slot Now
            </Link>
          </div>
        ) : queueData && (
          <div className="space-y-6">
            
            {/* Status Badge Banner */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase block">Procurement Status</span>
                <span className={`inline-block mt-1 px-3.5 py-1 rounded-full text-sm font-extrabold tracking-wide ${
                  queueData.status === 'CALLED' ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse' :
                  queueData.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border border-green-300' :
                  'bg-yellow-100 text-yellow-800 border border-yellow-300'
                }`}>
                  {queueData.status}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 font-semibold block uppercase">Centre & Crop</span>
                <span className="font-bold text-gray-900 text-sm">{queueData.centre} • {queueData.crop}</span>
              </div>
            </div>

            {/* Queue Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Farmer Token Card */}
              <div className="bg-gradient-to-br from-agri-800 to-agri-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="text-xs font-bold uppercase tracking-wider text-agri-200">Your Token Number</div>
                <div className="text-4xl font-mono font-extrabold my-2">{queueData.tokenNumber}</div>
                <div className="text-xs text-agri-200">Booking Ref: {queueData.bookingId}</div>
              </div>

              {/* Current Active Token Called */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Currently Called Token</div>
                  <div className="text-3xl font-mono font-extrabold text-blue-600 my-2">
                    {queueData.currentToken}
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-medium">Active at Officer Gate counter</div>
              </div>

            </div>

            {/* Position & Waiting Time Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Users className="w-6 h-6 text-agri-700 mx-auto mb-1" />
                  <span className="text-xs font-bold uppercase text-gray-500 block">Queue Position</span>
                  <span className="text-2xl font-extrabold text-gray-900">
                    {queueData.queuePosition > 0 ? `#${queueData.queuePosition}` : 'Completed'}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Users className="w-6 h-6 text-agri-700 mx-auto mb-1" />
                  <span className="text-xs font-bold uppercase text-gray-500 block">Farmers Ahead</span>
                  <span className="text-2xl font-extrabold text-gray-900">
                    {queueData.farmersAhead} Farmers
                  </span>
                </div>

                <div className="bg-agri-50 p-4 rounded-xl border border-agri-200">
                  <Clock className="w-6 h-6 text-agri-700 mx-auto mb-1" />
                  <span className="text-xs font-bold uppercase text-agri-800 block">Est. Waiting Time</span>
                  <span className="text-2xl font-extrabold text-agri-800">
                    {queueData.estimatedWaitingTime} Mins
                  </span>
                </div>

              </div>

              {/* Waiting Formula Explanation */}
              <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-600 flex items-center justify-between border border-gray-200">
                <span>Calculation Rule:</span>
                <span className="font-mono font-semibold text-gray-800">
                  Estimated Waiting Time = Farmers Ahead ({queueData.farmersAhead}) × 10 mins
                </span>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
