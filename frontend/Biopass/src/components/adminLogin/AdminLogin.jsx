import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Shield } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        // For demo: In a real app, replace with actual authentication logic
        console.log('Admin login attempt with:', { email, password, rememberMe });
        
        // Mock successful login
        navigate('/admin-dashboard');
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Authentication failed. Please check your credentials and try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center">
          <div className="bg-blue-500 rounded-full p-2 mr-3">
            <ArrowLeft className="text-white w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-semibold text-gray-800">Biopass</span>
            <span className="text-gray-500"> – Admin Login</span>
          </div>
        </div>
      </div>
      
      {/* Login Card */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md relative">
          {/* Shield icon at top */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-100 rounded-full p-4">
              <Shield className="text-blue-500 w-8 h-8" />
            </div>
          </div>
          
          <div className="p-8 pt-12">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Administrator Access</h2>
            <p className="text-gray-600 text-center mb-6">Please enter your credentials to manage the system</p>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div>
                  <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <button
                type="submit"
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-gray-600">
              Need technical support? <Link to="/contact-support" className="text-blue-500 hover:underline">Contact IT Support</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-6 flex justify-center">
        <Link to="/" className="text-blue-500 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Landing Page
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;