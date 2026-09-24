import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, LogOut, User, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('agriqueue_token');
  const userRole = localStorage.getItem('agriqueue_role');
  const userName = localStorage.getItem('agriqueue_user_name');

  const handleLogout = () => {
    localStorage.removeItem('agriqueue_token');
    localStorage.removeItem('agriqueue_role');
    localStorage.removeItem('agriqueue_user_name');
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Application Name */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-agri-700 text-white p-2 rounded-xl shadow-md group-hover:bg-agri-800 transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                Agri<span className="text-agri-700">Queue</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-agri-700 bg-agri-50 px-2 py-0.5 rounded-full border border-agri-200">
                APMC Smart System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/' ? 'text-agri-700' : 'text-gray-600 hover:text-agri-700'
              }`}
            >
              Home
            </Link>

            {token ? (
              <>
                {userRole === 'farmer' ? (
                  <Link
                    to="/farmer/dashboard"
                    className="text-sm font-semibold text-gray-600 hover:text-agri-700"
                  >
                    Farmer Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/officer/dashboard"
                    className="text-sm font-semibold text-gray-600 hover:text-agri-700"
                  >
                    Officer Dashboard
                  </Link>
                )}

                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full py-1.5 px-3">
                  <div className="bg-agri-100 p-1 rounded-full text-agri-700">
                    {userRole === 'officer' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-bold text-gray-800">
                    {userName || (userRole === 'officer' ? 'Officer' : 'Farmer')}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 p-1 rounded-full transition-colors ml-1"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/farmer/login"
                  className="text-sm font-semibold text-gray-700 hover:text-agri-700"
                >
                  Farmer Login
                </Link>
                <Link
                  to="/farmer/register"
                  className="text-sm font-semibold text-agri-700 bg-agri-50 hover:bg-agri-100 border border-agri-200 px-4 py-2 rounded-lg transition-colors"
                >
                  Farmer Register
                </Link>
                <Link
                  to="/officer/login"
                  className="text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  Officer Login
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-agri-700 p-2 rounded-md focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-700 hover:text-agri-700 py-2"
          >
            Home
          </Link>

          {token ? (
            <>
              {userRole === 'farmer' ? (
                <Link
                  to="/farmer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-700 hover:text-agri-700 py-2"
                >
                  Farmer Dashboard
                </Link>
              ) : (
                <Link
                  to="/officer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-700 hover:text-agri-700 py-2"
                >
                  Officer Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-base font-medium text-red-600 hover:text-red-700 py-2 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout ({userName})
              </button>
            </>
          ) : (
            <>
              <Link
                to="/farmer/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-gray-700 hover:text-agri-700 py-2"
              >
                Farmer Login
              </Link>
              <Link
                to="/farmer/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-agri-700 font-semibold py-2"
              >
                Farmer Registration
              </Link>
              <Link
                to="/officer/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-gray-900 font-semibold py-2"
              >
                Officer Login
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
