import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Calendar, Clock, MapPin, Sprout, AlertCircle, CheckCircle2, Ticket } from 'lucide-react';

export default function BookSlot() {
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    centre: 'Main Procurement Centre',
    crop: 'Paddy',
    quantity: '2500',
    date: todayStr,
    timeSlot: '09:00–10:00'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    // Pre-fetch user default crop & qty
    api.get('/auth/me').then(res => {
      if (res.success && res.user) {
        setFormData(prev => ({
          ...prev,
          crop: res.user.cropName || 'Paddy',
          quantity: String(res.user.expectedQuantity || '2500')
        }));
      }
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setConfirmation(null);

    const numQty = parseFloat(formData.quantity);
    if (isNaN(numQty) || numQty <= 0) {
      setError('Please enter a valid positive quantity in Kg.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/bookings', formData);
      if (res.success && res.booking) {
        setConfirmation(res.booking);
      }
    } catch (err) {
      setError(err.message || 'Failed to book slot. Please try another slot or time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-agri-100 text-agri-700 rounded-2xl mb-3">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Book Procurement Slot</h2>
          <p className="text-sm text-gray-500 mt-1">Select your preferred centre, date, and arrival time slot</p>
        </div>

        {/* Confirmation Screen if booked */}
        {confirmation ? (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-agri-500 shadow-lg text-center space-y-6">
            <div className="w-16 h-16 bg-agri-100 text-agri-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-50 border border-agri-200 px-3 py-1 rounded-full">
                Booking Confirmed
              </span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-3">Slot Reserved Successfully!</h3>
            </div>

            <div className="bg-agri-50 border border-agri-200 p-6 rounded-2xl grid grid-cols-2 gap-4 text-left">
              <div>
                <span className="text-xs text-gray-500 font-semibold block uppercase">Booking ID</span>
                <span className="text-lg font-extrabold text-gray-900">{confirmation.bookingId}</span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-semibold block uppercase">Token Number</span>
                <span className="text-xl font-mono font-extrabold text-agri-700">{confirmation.tokenNumber}</span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-semibold block uppercase">Queue Position</span>
                <span className="text-lg font-bold text-gray-900">Position #{confirmation.queuePosition}</span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-semibold block uppercase">Est. Waiting Time</span>
                <span className="text-lg font-bold text-gray-900">{confirmation.estimatedWaitingTime} minutes</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => navigate(`/farmer/queue?bookingId=${confirmation.bookingId}`)}
                className="bg-agri-700 hover:bg-agri-800 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Ticket className="w-5 h-5" />
                <span>Track Queue Live</span>
              </button>
              
              <button
                onClick={() => navigate('/farmer/dashboard')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-md">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Procurement Centre */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Procurement Centre *
                </label>
                <select
                  name="centre"
                  value={formData.centre}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
                >
                  <option value="Main Procurement Centre">Main Procurement Centre</option>
                  <option value="Village Procurement Centre">Village Procurement Centre</option>
                </select>
              </div>

              {/* Crop & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Crop *
                  </label>
                  <select
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
                  >
                    <option value="Paddy">Paddy</option>
                    <option value="Maize">Maize</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Wheat">Wheat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Expected Quantity (in Kg) *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 2500"
                    required
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
                  />
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Procurement Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Time Slot *
                  </label>
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-500 focus:border-agri-500 transition-all"
                  >
                    <option value="08:00–09:00">08:00–09:00</option>
                    <option value="09:00–10:00">09:00–10:00</option>
                    <option value="10:00–11:00">10:00–11:00</option>
                    <option value="11:00–12:00">11:00–12:00</option>
                    <option value="02:00–03:00">02:00–03:00</option>
                    <option value="03:00–04:00">03:00–04:00</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-agri-700 hover:bg-agri-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Checking Slot & Reserving...</span>
                ) : (
                  <>
                    <Ticket className="w-5 h-5" />
                    <span>Confirm & Generate Booking Token</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
