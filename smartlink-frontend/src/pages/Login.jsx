import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Official Google OAuth Trigger
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError('');
      try {
        await googleLogin(tokenResponse.access_token);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Google Login failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Google OAuth error:", errorResponse);
      setError("Google OAuth authentication failed");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans">
      
      {/* Left Column: Login Form */}
      <div className="w-full md:w-[48%] flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-20 z-10 bg-white">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            Ai Appsec lab
          </span>
          <span className="text-[#7c3aed] text-xl font-black">★</span>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="space-y-2 mb-8">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-base text-gray-500 font-medium">
              Log in to your Ai Appsec lab account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm font-semibold animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent transition-all bg-gray-50/50 hover:bg-gray-50"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent transition-all bg-gray-50/50 hover:bg-gray-50"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#7c3aed] text-white rounded-full font-bold text-base hover:bg-[#6d28d9] active:scale-[0.99] transition-all shadow-md hover:shadow-lg cursor-pointer mt-2"
            >
              Log in
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative bg-white px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
              OR
            </span>
          </div>

          {/* Social Logins */}
          <div className="space-y-3.5">
            <button
              type="button"
              disabled={googleLoading}
              onClick={() => triggerGoogleLogin()}
              className="w-full flex justify-center items-center py-3.5 px-6 border border-gray-200 rounded-full bg-white text-sm font-bold text-gray-800 hover:bg-gray-50 transition-all cursor-pointer shadow-2xs hover:border-gray-300"
            >
              {googleLoading ? (
                <span className="flex items-center gap-2 text-gray-600 font-medium">
                  <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating with Google...
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>

          {/* Sign Up Links */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-sm font-medium text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#7c3aed] font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-400 text-center font-medium">
          © {new Date().getFullYear()} Ai Appsec lab. All rights reserved.
        </div>
      </div>

      {/* Right Column: Hero Art */}
      <div className="w-full md:w-[52%] bg-[#1e2338] relative overflow-hidden flex items-center justify-center p-8 lg:p-16 min-h-[450px] md:min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e2338] via-[#0f172a] to-[#1e1b4b] opacity-95"></div>

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
          <div className="w-full max-w-sm bg-[#1e293b]/90 border border-slate-700/50 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative transform transition-transform hover:scale-[1.01] duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-purple-500/30 p-1 bg-slate-900 shadow-xl">
                <img 
                  src="https://lh3.googleusercontent.com/a/default-user=s96-c" 
                  alt="Samay Raina" 
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
                  }}
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full mb-3">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                <span className="text-xs font-semibold text-purple-300">@SamayRainaOfficial</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">Samay Raina</h2>
              <p className="text-xs font-medium text-slate-400 mb-4 max-w-[240px]">
                Comedian • Chess Enthusiast • Creator of India's Got Latent
              </p>

              <div className="w-full bg-slate-900/90 rounded-2xl p-4 border border-slate-700/40 text-left mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-purple-400">LATENT SHOW PASS</p>
                  <p className="text-lg font-black text-white">₹499</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-md">
                  Get Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
