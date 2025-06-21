import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, User } from 'lucide-react';

const StudentLogin = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!registrationNumber.trim()) {
      setError('Registration number is required');
      return;
    }
    
    if (!birthYear.trim() || birthYear.length !== 4 || isNaN(birthYear)) {
      setError('Please enter a valid birth year (YYYY)');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        // For demo: In a real app, replace with actual authentication logic
        console.log('Login attempt with:', { registrationNumber, birthYear });
        
        // Mock successful login
        navigate('/student-dashboard');
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Authentication failed. Please check your details and try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center">
          <div
            className="bg-blue-500 rounded-full p-2 mr-3 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="text-white w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-semibold text-gray-800">Biopass</span>
            <span className="text-gray-500"> – Student Login</span>
          </div>
        </div>
      </div>
      
      {/* Login Card */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md relative">
          {/* User icon at top */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-100 rounded-full p-4">
              <User className="text-blue-500 w-8 h-8" />
            </div>
          </div>
          
          <div className="p-8 pt-12">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-center mb-6">Please enter your details to access your account</p>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="registration" className="block text-gray-700 mb-2">
                  Enter your Registration Number
                </label>
                <input
                  type="text"
                  id="registration"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="REG123456"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="birthYear" className="block text-gray-700 mb-2">
                  Enter your Birth Year (YYYY)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="birthYear"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="••••"
                    maxLength="4"
                    value={birthYear}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow digits
                      if (value === '' || /^\d+$/.test(value)) {
                        setBirthYear(value);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-gray-600">
              Forgot Access? <Link to="/contact-admin" className="text-blue-500 hover:underline">Contact Admin</Link>
            </div>
          </div>
        </div>
      </div>
      <>
        <Link to="/" className="text-blue-500 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Landing Page
        </Link>
      </>
    </div>
  );
};

export default StudentLogin;

