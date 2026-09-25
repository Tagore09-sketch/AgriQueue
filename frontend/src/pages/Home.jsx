import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ClipboardCheck, CreditCard, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-between text-gray-100">
      <div>
        {/* Hero Section with Vibrant Farmer Background Image */}
        <section className="relative min-h-[580px] sm:min-h-[660px] flex items-center justify-center overflow-hidden border-b border-gray-800">
          
          {/* Background Image Layer - Bright, Clear & Vibrant */}
          <div className="absolute inset-0 z-0">
            <img
              src="/farmer_bg.jpg"
              alt="AgriQueue Farmer Background"
              className="w-full h-full object-cover object-center transform scale-100 opacity-90 filter brightness-95 contrast-105"
            />
            {/* Soft Gradient Overlay so image stays fully visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-transparent to-gray-900/60" />
          </div>

          {/* Hero Content Container with High-Contrast Glassmorphism */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            
            {/* Highlighted Glowing Brand Title Header */}
            <div className="inline-flex items-center justify-center gap-3 bg-gray-950/90 backdrop-blur-xl border-2 border-amber-400/80 px-6 py-3 rounded-3xl shadow-2xl mb-6 ring-4 ring-amber-400/20">
              <img
                src="/farmer_logo.png"
                alt="AgriQueue Farmer Emblem"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-xl p-0.5 bg-gray-900 border border-amber-400 shadow-lg"
              />
              <div className="text-left">
                <span className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-agri-400 tracking-tight block">
                  AgriQueue
                </span>
                <span className="text-[11px] sm:text-xs font-black tracking-widest text-agri-300 uppercase block">
                  Smart APMC Procurement & Queue System
                </span>
              </div>
            </div>


            {/* Hero Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
              Avoid Long Waiting at <span className="text-transparent bg-clip-text bg-gradient-to-r from-agri-400 via-emerald-300 to-green-400">APMC Procurement Centres</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-xl text-white mb-8 max-w-3xl mx-auto font-bold leading-relaxed drop-shadow-md bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              AgriQueue empowers farmers to book procurement slots in advance, track live queue positions, view digital inspection records, and track real-time bank payment disbursals.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
              <Link
                to="/farmer/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-agri-600 hover:bg-agri-700 text-white font-extrabold text-base px-7 py-4 rounded-xl shadow-2xl shadow-agri-600/50 transition-all hover:scale-105 active:scale-95"
              >
                <span>Farmer Registration</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/farmer/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold text-base px-7 py-4 rounded-xl border border-white/40 shadow-xl transition-all"
              >
                <span>Farmer Login</span>
              </Link>

              <Link
                to="/officer/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-950 hover:bg-black border border-gray-700 text-gray-100 font-extrabold text-base px-7 py-4 rounded-xl shadow-xl transition-all"
              >
                <span>Officer Console</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Designed for Seamless APMC Crop Procurement</h2>
            <p className="text-gray-400 text-sm mt-2">Empowering farmers with transparent queue schedules & instant status updates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-agri-500 transition-all">
              <div className="w-12 h-12 bg-agri-500/20 text-agri-400 rounded-xl flex items-center justify-center mb-4 border border-agri-500/30">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Slot Booking</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Book a convenient procurement slot at your nearest APMC centre without hassle.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-agri-500 transition-all">
              <div className="w-12 h-12 bg-agri-500/20 text-agri-400 rounded-xl flex items-center justify-center mb-4 border border-agri-500/30">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Queue Tracking</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Track live queue position and estimated waiting time directly from your mobile.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-agri-500 transition-all">
              <div className="w-12 h-12 bg-agri-500/20 text-agri-400 rounded-xl flex items-center justify-center mb-4 border border-agri-500/30">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Procurement Tracking</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Know current procurement status from Check-In to Weighment completion.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-agri-500 transition-all">
              <div className="w-12 h-12 bg-agri-500/20 text-agri-400 rounded-xl flex items-center justify-center mb-4 border border-agri-500/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">4. Payment Tracking</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Check payment status and view bank UTR transaction references once procurement finishes.
              </p>
            </div>

          </div>
        </section>

        {/* Benefits Bar */}
        <section className="bg-agri-950 border-t border-agri-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-agri-400 mb-2" />
              <h4 className="font-bold text-lg">Zero Long Queue Delays</h4>
              <p className="text-xs text-agri-300 mt-1">Guaranteed slot arrival times for every farmer</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-agri-400 mb-2" />
              <h4 className="font-bold text-lg">Transparent Weighment</h4>
              <p className="text-xs text-agri-300 mt-1">Direct officer log in Quintals & Kgs with quality check</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-agri-400 mb-2" />
              <h4 className="font-bold text-lg">24-Hour Bank Credit SLA</h4>
              <p className="text-xs text-agri-300 mt-1">Direct bank credit with toll-free support helpline</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
