import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { User, Phone, ShieldCheck, MapPin, Sprout, Calendar, Clock, ClipboardCheck, CreditCard, LogOut, Plus, ChevronRight, Building2 } from 'lucide-react';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const resUser = await api.get('/auth/me');
      if (resUser.success) {
        setUser(resUser.user);
      }

      const resBookings = await api.get('/bookings/my');
      if (resBookings.success) {
        setBookings(resBookings.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load farmer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeBooking = bookings.find(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED') || bookings[0];

  const handleLogout = () => {
    localStorage.removeItem('agriqueue_token');
    localStorage.removeItem('agriqueue_role');
    localStorage.removeItem('agriqueue_user_name');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center font-bold text-agri-700 animate-pulse text-lg">
          Loading Farmer Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-agri-100 text-agri-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Sprout className="w-4 h-4" /> Farmer Profile Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Welcome, {user?.name || 'Ravi Kumar'}
            </h1>
            <p className="text-sm text-gray-500">Manage your APMC procurement bookings, queue position, and payments</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/farmer/book-slot"
              className="bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Book New Slot
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm py-2.5 px-4 rounded-xl transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Farmer Information & Bank Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <User className="w-5 h-5 text-agri-700" />
              <span>Farmer Profile & Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div>
                <span className="text-xs text-gray-500 font-semibold block uppercase">Full Name</span>
                <span className="font-bold text-gray-900 text-base">{user?.name}</span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-semibold block uppercase">Mobile Number</span>
                <span className="font-semibold text-gray-800">{user?.mobile}</span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-semibold block uppercase">Masked Aadhaar</span>
                <span className="font-mono font-bold text-agri-700">XXXX-XXXX-{user?.aadhaarLast4}</span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-semibold block uppercase">Village / District</span>
                <span className="font-semibold text-gray-800">{user?.village}, {user?.district}</span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-semibold block uppercase">Registered Crop</span>
                <span className="font-bold text-gray-900">{user?.cropName}</span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-semibold block uppercase">Land Area</span>
                <span className="font-semibold text-gray-800">{user?.landArea} Acres</span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-semibold block uppercase">Expected Quantity</span>
                <span className="font-semibold text-gray-800">{user?.expectedQuantity} Kg</span>
              </div>
            </div>
          </div>

          {/* Bank Account Sub-card */}
          <div className="bg-agri-50/50 border border-agri-200 p-5 rounded-xl">
            <h3 className="text-xs font-bold text-agri-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-agri-700" /> Registered Direct Bank Disbursal Account
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-gray-500 font-medium block">Bank Name</span>
                <span className="font-bold text-gray-900">{user?.bankName || 'State Bank of India'}</span>
              </div>

              <div>
                <span className="text-gray-500 font-medium block">Account Number</span>
                <span className="font-mono font-bold text-gray-900">••••••••{user?.accountNumber ? String(user.accountNumber).slice(-4) : '1234'}</span>
              </div>

              <div>
                <span className="text-gray-500 font-medium block">IFSC Code</span>
                <span className="font-mono font-bold text-agri-700">{user?.ifscCode || 'SBIN0004123'}</span>
              </div>

              <div>
                <span className="text-gray-500 font-medium block">UPI ID</span>
                <span className="font-semibold text-gray-800">{user?.upiId || 'N/A'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Four Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Current Booking */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase text-gray-400">Current Booking</span>
                <Calendar className="w-5 h-5 text-agri-700" />
              </div>
              <div className="font-extrabold text-xl text-gray-900">
                {activeBooking ? activeBooking.bookingId : 'No Booking'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {activeBooking ? `${activeBooking.centre} (${activeBooking.timeSlot})` : 'Book a procurement slot'}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100">
              <Link
                to="/farmer/book-slot"
                className="text-xs font-bold text-agri-700 hover:text-agri-800 inline-flex items-center gap-1"
              >
                <span>Book Slot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Queue Position */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase text-gray-400">Queue Position</span>
                <Clock className="w-5 h-5 text-agri-700" />
              </div>
              <div className="font-extrabold text-2xl text-agri-700">
                {activeBooking ? `Pos #${activeBooking.queuePosition || 1}` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {activeBooking ? `Est. Wait: ${activeBooking.estimatedWaitingTime || 0} mins` : 'Queue inactive'}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100">
              {activeBooking ? (
                <Link
                  to={`/farmer/queue?bookingId=${activeBooking.bookingId}`}
                  className="text-xs font-bold text-agri-700 hover:text-agri-800 inline-flex items-center gap-1"
                >
                  <span>View Queue Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-xs text-gray-400">View Queue</span>
              )}
            </div>
          </div>

          {/* Card 3: Procurement Status */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase text-gray-400">Procurement Status</span>
                <ClipboardCheck className="w-5 h-5 text-agri-700" />
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wide ${
                activeBooking?.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border border-green-300' :
                activeBooking?.status === 'CALLED' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                'bg-yellow-100 text-yellow-800 border border-yellow-300'
              }`}>
                {activeBooking?.status || 'NOT_STARTED'}
              </span>
              <div className="text-xs text-gray-500 mt-2">
                Crop: {activeBooking?.crop || user?.cropName}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100">
              {activeBooking ? (
                <Link
                  to={`/farmer/procurement?bookingId=${activeBooking.bookingId}`}
                  className="text-xs font-bold text-agri-700 hover:text-agri-800 inline-flex items-center gap-1"
                >
                  <span>View Procurement</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-xs text-gray-400">View Procurement</span>
              )}
            </div>
          </div>

          {/* Card 4: Payment Status */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase text-gray-400">Payment Status</span>
                <CreditCard className="w-5 h-5 text-agri-700" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-gray-100 text-gray-700 border border-gray-300">
                {activeBooking?.status === 'COMPLETED' ? 'INVOICE GENERATED' : 'AWAITING_PROCUREMENT'}
              </span>
              <div className="text-xs text-gray-500 mt-2">Direct bank disbursal update</div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100">
              {activeBooking ? (
                <Link
                  to={`/farmer/payment?bookingId=${activeBooking.bookingId}`}
                  className="text-xs font-bold text-agri-700 hover:text-agri-800 inline-flex items-center gap-1"
                >
                  <span>View Official Invoice & Payment</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-xs text-gray-400">View Payment</span>
              )}
            </div>
          </div>

        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Booking History</h3>

          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              You have no active or previous slot bookings. Click "Book New Slot" above to start.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase bg-gray-50">
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Token #</th>
                    <th className="py-3 px-4">Centre</th>
                    <th className="py-3 px-4">Crop & Qty</th>
                    <th className="py-3 px-4">Slot Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map(b => (
                    <tr key={b.bookingId} className="hover:bg-gray-50">
                      <td className="py-3.5 px-4 font-bold text-gray-900">{b.bookingId}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-agri-700">{b.tokenNumber}</td>
                      <td className="py-3.5 px-4 text-gray-700">{b.centre}</td>
                      <td className="py-3.5 px-4 text-gray-700">{b.crop} ({b.quantity} Kg)</td>
                      <td className="py-3.5 px-4 text-gray-700">{b.date} [{b.timeSlot}]</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-agri-100 text-agri-800">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          to={`/farmer/queue?bookingId=${b.bookingId}`}
                          className="text-xs font-bold text-agri-700 hover:underline"
                        >
                          Queue
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                          to={`/farmer/payment?bookingId=${b.bookingId}`}
                          className="text-xs font-bold text-agri-700 hover:underline"
                        >
                          Invoice / Payment
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
