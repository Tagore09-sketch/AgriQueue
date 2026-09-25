import React, { useState } from 'react';
import { MapPin, Navigation, Clock, CheckCircle, ExternalLink, ShieldCheck, Compass, Info } from 'lucide-react';

export const APMC_CENTRES = [
  {
    id: 'main-guntur',
    name: 'Main APMC Central Yard (Guntur)',
    type: 'Main Central Hub',
    address: 'NH-16, GT Road, Guntur APMC Market Complex, AP - 522001',
    distance: '4.5 km from village',
    coords: '16.3067, 80.4365',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61245.89201!2d80.4000!3d16.3000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a755cb17877d5%3A0x9f798e4d2a10!2sGuntur%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    directMapUrl: 'https://maps.google.com/?q=16.3067,80.4365',
    hours: '08:00 AM - 06:00 PM',
    capacity: '1,000 Qtl / Day',
    status: 'Open & Active',
    officer: 'N. Rama Rao (Senior Procurement Officer)'
  },
  {
    id: 'village-vadlamudi',
    name: 'Vadlamudi Village APMC Procurement Hub',
    type: 'Village Sub-Centre',
    address: 'Vignan College Road, Vadlamudi APMC Yard, Guntur Dist - 522213',
    distance: '1.2 km from village centre',
    coords: '16.2341, 80.5528',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15315.6!2d80.5500!3d16.2300!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a70e79ef0b407%3A0x6b4a5f4c54157d0!2sVadlamudi%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    directMapUrl: 'https://maps.google.com/?q=16.2341,80.5528',
    hours: '08:30 AM - 05:30 PM',
    capacity: '500 Qtl / Day',
    status: 'Open & Active',
    officer: 'P. Venkateswarlu (Village Procurement Officer)'
  },
  {
    id: 'tenali-hub',
    name: 'Tenali APMC Regional Procurement Centre',
    type: 'Regional Sub-Yard',
    address: 'Bose Road, APMC Market Yard, Tenali - 522201',
    distance: '8.2 km',
    coords: '16.2430, 80.6400',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3829.8!2d80.6400!3d16.2430!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a070100000001%3A0x123456789!2sTenali%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    directMapUrl: 'https://maps.google.com/?q=16.2430,80.6400',
    hours: '08:00 AM - 06:00 PM',
    capacity: '750 Qtl / Day',
    status: 'Open & Active',
    officer: 'K. Srinivasa Rao (Procurement Officer)'
  }
];

export default function ProcurementMap({ selectedCentreId, onSelectCentre }) {
  const [activeCentre, setActiveCentre] = useState(
    APMC_CENTRES.find(c => c.name === selectedCentreId || c.id === selectedCentreId) || APMC_CENTRES[0]
  );

  const handleSelect = (centre) => {
    setActiveCentre(centre);
    if (onSelectCentre) {
      onSelectCentre(centre.name);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-agri-700" />
            <span>Nearest APMC Procurement Centres & Google Maps</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Locate nearest Main APMC Central Yards and Village Procurement Sub-Centres with live GPS navigation
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live GPS Active
        </span>
      </div>

      {/* Grid: Left Centre Selector Cards, Right Google Maps Embed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Centre Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Select APMC Centre ({APMC_CENTRES.length} Available Nearby):
          </label>
          {APMC_CENTRES.map((centre) => {
            const isSelected = activeCentre.id === centre.id || activeCentre.name === centre.name;
            return (
              <div
                key={centre.id}
                onClick={() => handleSelect(centre)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-agri-600 bg-agri-50/80 shadow-md ring-2 ring-agri-500/20'
                    : 'border-gray-200 bg-white hover:border-agri-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-agri-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900 leading-snug">{centre.name}</h4>
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-agri-100 text-agri-800 rounded mt-1">
                        {centre.type}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-agri-700 flex-shrink-0 mt-1" />
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200/60 text-xs text-gray-600 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-agri-600" />
                    <span className="font-semibold text-gray-800">{centre.distance}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{centre.hours}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">
                    📍 {centre.address}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Google Maps Preview & Directions */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-300 shadow-inner relative flex-1 min-h-[320px]">
            {/* Google Map Embedded iframe */}
            <iframe
              title={`Google Map for ${activeCentre.name}`}
              src={activeCentre.embedUrl}
              className="w-full h-full min-h-[320px] border-0"
              loading="lazy"
              allowFullScreen
            ></iframe>

            {/* Floating Info Overlay */}
            <div className="absolute top-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-gray-900 block">{activeCentre.name}</span>
                <span className="text-gray-500 text-[11px]">Daily Cap: {activeCentre.capacity}</span>
              </div>
              <a
                href={activeCentre.directMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-agri-700 hover:bg-agri-800 text-white font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95"
              >
                <span>Navigate</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Officer Details Banner */}
          <div className="mt-3 bg-agri-50 border border-agri-200 rounded-xl p-3 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-agri-700" />
              <span className="text-gray-700 font-medium">In-Charge Officer: <strong className="text-gray-900">{activeCentre.officer}</strong></span>
            </div>
            <span className="text-agri-800 font-bold bg-white px-2.5 py-1 rounded-md border border-agri-200 shadow-2xs">
              {activeCentre.status}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
