import React, { useState } from "react";
import { Mail, Menu, X } from "lucide-react";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "../pages/login.jsx";

const RendererNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const {    } = useSelector((state) => state.auth?.user)
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const currentLocation = useLocation().pathname;
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-100 z-50">
      {currentLocation === "/register" ? (
        // Header register and login
        <div className="sm:px-8 px-4 flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="w-16 h-8 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">Email</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Have a Email Account?{" "}
            <button onClick={() => navigate('/login')} className="text-red-600 hover:text-red-700 font-medium cursor-pointer">
              SIGN IN
            </button>
          </div>
        </div>
      ) : (
        currentLocation === '/' && <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">MailFlow</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Contact
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <div>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Sign In
                </button>

                {showLogin && (
                  <div
                    className="fixed inset-0 bg-blackbg-opacity-40 flex items-center justify-center z-10 bg-red-400 p-8 "
                    onClick={() => setShowLogin(false)}
                  >
                    <div className="bg-black/10 rounded-2xl shadow-lg p-8 relative max-w-lg w-full">
                      <button
                        onClick={() => setShowLogin(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 m-2"
                      >
                        ✕
                      </button>
                      <LoginPage />
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => redirect("register")}
                className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Pricing
                </a>
                <a
                  href="#about"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Contact
                </a>
                <div className="pt-4 border-t border-gray-100">
                  <button className="w-full text-left text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 mb-3">
                    Sign In
                  </button>
                  <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default RendererNavbar;
