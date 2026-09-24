import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ClipboardCheck, CreditCard, ArrowRight, CheckCircle, Sprout } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-agri-50 via-white to-gray-50 flex flex-col justify-between">
      <div>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-agri-100 border border-agri-200 text-agri-800 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-6 shadow-sm">
              <Sprout className="w-4 h-4 text-agri-700" />
              <span>Book. Queue. Procure. Get Paid.</span>
            </div>

            {/* Hero Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              Avoid Long Waiting at <span className="text-agri-700">Procurement Centres</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
              AgriQueue helps farmers book procurement slots, track their queue, monitor procurement progress, and check payment status.
            </p>

            {/* Hero Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/farmer/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-agri-700 hover:bg-agri-800 text-white font-bold text-base px-6 py-3.5 rounded-xl shadow-lg shadow-agri-700/20 transition-all hover:scale-105"
              >
                <span>Farmer Registration</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/farmer/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-agri-800 font-bold text-base px-6 py-3.5 rounded-xl border-2 border-agri-700 shadow-sm transition-all"
              >
                <span>Farmer Login</span>
              </Link>

              <Link
                to="/officer/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-base px-6 py-3.5 rounded-xl shadow-md transition-all"
              >
                <span>Officer Login</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Designed for Seamless Crop Procurement</h2>
            <p className="text-gray-500 text-sm mt-2">Empowering farmers with transparent queue schedules & instant status updates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:border-agri-300">
              <div className="w-12 h-12 bg-agri-100 text-agri-700 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. Slot Booking</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Book a convenient procurement slot at your nearest APMC centre without hassle.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:border-agri-300">
              <div className="w-12 h-12 bg-agri-100 text-agri-700 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. Queue Tracking</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Track live queue position and estimated waiting time directly from your mobile.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:border-agri-300">
              <div className="w-12 h-12 bg-agri-100 text-agri-700 rounded-xl flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. Procurement Tracking</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Know the current procurement status from Check-In to Weighment completion.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:border-agri-300">
              <div className="w-12 h-12 bg-agri-100 text-agri-700 rounded-xl flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">4. Payment Tracking</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Check payment status and view transaction references once procurement finishes.
              </p>
            </div>

          </div>
        </section>

        {/* Benefits Bar */}
        <section className="bg-agri-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-agri-400 mb-2" />
              <h4 className="font-bold text-lg">Zero Long Queue Delays</h4>
              <p className="text-xs text-agri-200 mt-1">Guaranteed slot times for every farmer</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-agri-400 mb-2" />
              <h4 className="font-bold text-lg">Transparent Weighment</h4>
              <p className="text-xs text-agri-200 mt-1">Direct officer log and quality checks</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-agri-400 mb-2" />
              <h4 className="font-bold text-lg">Direct Payment Updates</h4>
              <p className="text-xs text-agri-200 mt-1">Track status from Pending to Completed</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
