import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ClipboardCheck, CreditCard, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-emerald-950 to-gray-950 flex flex-col justify-between text-gray-100">
      <div>
        {/* Hero Section with Vibrant Farmer Background Image */}
        <section className="relative min-h-[580px] sm:min-h-[660px] flex items-center justify-center overflow-hidden border-b border-emerald-900/60">
          
          {/* Background Image Layer with Up Light / Down Dark Gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src="/farmer_bg.jpg"
              alt="AgriQueue Farmer Background"
              className="w-full h-full object-cover object-center transform scale-100 opacity-90 filter brightness-95 contrast-105"
            />
            {/* Gradient Overlay: Light Amber at top, transitioning to deep emerald and dark gray at bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-100/60 via-emerald-950/70 to-gray-950/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/60 via-transparent to-emerald-950/60" />
          </div>

          {/* Hero Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            
            {/* 1. Brand Tag */}
            <div className="inline-flex items-center gap-2 bg-amber-100/95 backdrop-blur-md border border-amber-300/80 text-emerald-900 text-sm sm:text-base font-extrabold px-5 py-2 rounded-full mb-6 shadow-xl ring-2 ring-amber-400/40">
              <img src="/farmer_logo.png" alt="AgriQueue Logo" className="w-6 h-6 object-contain rounded-md p-0.5 bg-gray-900 border border-amber-400" />
              <span>AgriQueue - Smart APMC Procurement System</span>
            </div>

            {/* 2. Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-xl max-w-4xl mx-auto">
              Avoid Long Waiting at <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-green-400">APMC Procurement Centres</span>
            </h1>

            {/* 3. Description */}
            <p className="text-base sm:text-lg text-emerald-100 mb-8 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md bg-emerald-950/80 backdrop-blur-md p-5 rounded-2xl border border-emerald-400/30">
              Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status at agricultural procurement centres.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
              <Link
                to="/farmer/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base px-7 py-4 rounded-xl shadow-2xl shadow-emerald-600/50 transition-all hover:scale-105 active:scale-95 border border-emerald-400/40"
              >
                <span>Farmer Registration</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/farmer/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-md text-amber-200 font-extrabold text-base px-7 py-4 rounded-xl border border-amber-400/50 shadow-xl transition-all"
              >
                <span>Farmer Login</span>
              </Link>

              <Link
                to="/officer/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-950 hover:bg-black border border-emerald-700/80 text-emerald-100 font-extrabold text-base px-7 py-4 rounded-xl shadow-xl transition-all"
              >
                <span>Officer Console</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Section - Transitioning into Dark Charcoal Emerald */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Designed for Seamless APMC Crop Procurement</h2>
            <p className="text-emerald-300/80 text-sm mt-2">Empowering farmers with transparent queue schedules & instant status updates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-emerald-950/90 to-gray-900/90 backdrop-blur-md p-6 rounded-2xl border border-emerald-800/60 shadow-xl hover:border-amber-400 transition-all">
              <div className="w-12 h-12 bg-amber-400/20 text-amber-300 rounded-xl flex items-center justify-center mb-4 border border-amber-400/30">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Slot Booking</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Book a convenient procurement slot at your nearest APMC centre without hassle.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-emerald-950/90 to-gray-900/90 backdrop-blur-md p-6 rounded-2xl border border-emerald-800/60 shadow-xl hover:border-amber-400 transition-all">
              <div className="w-12 h-12 bg-amber-400/20 text-amber-300 rounded-xl flex items-center justify-center mb-4 border border-amber-400/30">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Queue Tracking</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Track live queue position and estimated waiting time directly from your mobile.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-emerald-950/90 to-gray-900/90 backdrop-blur-md p-6 rounded-2xl border border-emerald-800/60 shadow-xl hover:border-amber-400 transition-all">
              <div className="w-12 h-12 bg-amber-400/20 text-amber-300 rounded-xl flex items-center justify-center mb-4 border border-amber-400/30">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Procurement Tracking</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Know current procurement status from Check-In to Weighment completion.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-gradient-to-br from-emerald-950/90 to-gray-900/90 backdrop-blur-md p-6 rounded-2xl border border-emerald-800/60 shadow-xl hover:border-amber-400 transition-all">
              <div className="w-12 h-12 bg-amber-400/20 text-amber-300 rounded-xl flex items-center justify-center mb-4 border border-amber-400/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">4. Payment Tracking</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Check payment status and view bank UTR transaction references once procurement finishes.
              </p>
            </div>

          </div>
        </section>

        {/* Benefits Bar - Dark Deep Bottom Bar */}
        <section className="bg-gray-950 border-t border-emerald-900/80 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-amber-400 mb-2" />
              <h4 className="font-bold text-lg">Zero Long Queue Delays</h4>
              <p className="text-xs text-emerald-300 mt-1">Guaranteed slot arrival times for every farmer</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-amber-400 mb-2" />
              <h4 className="font-bold text-lg">Transparent Weighment</h4>
              <p className="text-xs text-emerald-300 mt-1">Direct officer log in Quintals & Kgs with quality check</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-amber-400 mb-2" />
              <h4 className="font-bold text-lg">24-Hour Bank Credit SLA</h4>
              <p className="text-xs text-emerald-300 mt-1">Direct bank credit with toll-free support helpline</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
