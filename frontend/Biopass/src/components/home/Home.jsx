import React from 'react';
import { Link } from 'react-router-dom';

// You'll need to add these icons to your assets folder or use an icon library
import biometricIcon from '../../assets/biometric-icon.svg';
import trackingIcon from '../../assets/tracking-icon.svg';
import dashboardIcon from '../../assets/dashboard-icon.svg';
import eyeIcon from '../../assets/eye-icon.svg';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="border-b py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-indigo-600 text-2xl font-bold">BioPass</Link>
            <div className="ml-2 bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
              <span>M</span>
            </div>
          </div>
          <div className="flex space-x-8">
            <Link to="/" className="text-gray-700">Home</Link>
            <Link to="/about" className="text-gray-700">About</Link>
            <Link to="/contact" className="text-gray-700">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow bg-gray-100">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row">
            {/* Left side content */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Smarter Attendance.<br />
                Safer Access.
              </h1>
              <p className="text-gray-600 mb-8 max-w-md">
                Biopass brings you secure and seamless attendance with real-time biometric tracking.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/student-login" 
                  className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition"
                >
                  Student Login
                </Link>
                <Link 
                  to="/admin-login" 
                  className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-md hover:bg-indigo-50 transition"
                >
                  Admin Login
                </Link>
              </div>
            </div>

            {/* Right side image */}
            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-4 border-green-500 rounded-full"></div>
                    <div className="absolute inset-0 flex justify-center items-center">
                      {/* Replace with actual eye icon */}
                      <div className="text-indigo-600">
                        <img src={eyeIcon} alt="Eye icon" className="w-16 h-16" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-600 mt-4">Secure Biometric Authentication</p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-10 h-10 text-indigo-600 mb-4">
                <img src={biometricIcon} alt="Biometric icon" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Biometric Verification</h3>
              <p className="text-gray-600 text-sm">
                Secure fingerprint and face recognition technology
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-10 h-10 text-green-500 mb-4">
                <img src={trackingIcon} alt="Tracking icon" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600 text-sm">
                Monitor attendance data as it happens
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-10 h-10 text-indigo-600 mb-4">
                <img src={dashboardIcon} alt="Dashboard icon" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Easy Admin Dashboard</h3>
              <p className="text-gray-600 text-sm">
                Manage users and view detailed reports
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">© 2025 BioPass. All rights reserved.</p>
            </div>
            <div className="flex mb-4 md:mb-0">
              <Link to="/privacy" className="text-sm text-gray-600 mr-6">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-gray-600">Terms of Service</Link>
            </div>
            <div className="flex space-x-4">
              {/* Social media icons */}
              <a href="#" className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">1</span>
              </a>
              <a href="#" className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">2</span>
              </a>
              <a href="#" className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">3</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

