import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Direct Google OAuth standard trigger (No modal, opens official Google login window)
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError('');
      try {
        await googleLogin(tokenResponse.access_token);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Google Authentication failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Google OAuth error:", errorResponse);
      setError("Google Sign-In failed or popup was closed.");
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
      
      {/* Left Column: Auth Form */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16">
        
        {/* Top Logo */}
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center text-slate-900 group">
            <span className="font-black text-2xl tracking-tight text-gray-900">Ai Appsec lab</span>
            <span className="font-black text-2xl text-[#10b981] ml-0.5">*</span>
          </Link>
        </div>

        {/* Center Form Section */}
        <div className="max-w-md w-full mx-auto py-8">
          
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none mb-3">
              Welcome back
            </h1>
            <p className="text-gray-500 text-base font-medium">
              Log in to your Ai Appsec lab account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium mb-6">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                required
                placeholder="Email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:bg-white transition-all"
              />
            </div>

            <div>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-base rounded-full shadow-lg shadow-purple-500/25 transition-all cursor-pointer transform active:scale-98 mt-2"
            >
              Log in
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">OR</span>
            </div>
          </div>

          {/* Social Auth Buttons */}
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
                  Connecting to Google...
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

            <button
              type="button"
              onClick={() => alert('Apple Authentication is coming soon!')}
              className="w-full flex justify-center items-center py-3.5 px-6 border border-gray-200 rounded-full bg-white text-sm font-bold text-gray-800 hover:bg-gray-50 transition-all cursor-pointer shadow-2xs hover:border-gray-300"
            >
              <svg className="w-5 h-5 mr-3 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.12-1 .04-2.19.67-2.88 1.47-.62.72-1.16 1.88-1.01 3.01 1.12.09 2.24-.54 2.9-1.36z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Recovery & Sign Up Links */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-sm font-semibold text-[#7c3aed]">
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Use Google Sign-in to authenticate directly.'); }} className="hover:underline">Forgot password?</a>
              <span className="text-gray-300 mx-2">•</span>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Your username is your account email.'); }} className="hover:underline">Forgot username?</a>
            </p>

            <p className="text-sm font-medium text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#7c3aed] font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-400 font-medium">
          © 2026 Ai Appsec lab. All rights reserved.
        </div>

      </div>

      {/* Right Column: Hero Graphic Section (Samay Raina Feature) */}
      <div className="hidden md:flex w-1/2 bg-[#090b10] relative flex-col justify-between p-12 lg:p-16 overflow-hidden">
        
        {/* Background Decorative Glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Badges */}
        <div className="flex justify-between items-center relative z-10">
          <span className="px-3.5 py-1 bg-white/10 backdrop-blur-md text-emerald-400 font-semibold text-xs rounded-full border border-emerald-500/30">
            ★ Official Creator Space
          </span>
          <div className="flex gap-2">
            <span className="w-8 h-8 rounded-full bg-red-600/80 flex items-center justify-center text-white text-xs font-bold shadow-md">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.017 3.017 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </span>
            <span className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-red-600 font-black text-xs border border-red-500/30">
              N
            </span>
          </div>
        </div>

        {/* Center Hero Card: Samay Raina */}
        <div className="my-auto relative z-10 flex justify-center py-6">
          <div className="relative w-full max-w-sm">
            <div className="bg-[#13161f]/95 backdrop-blur-xl rounded-3xl p-6 border border-[#1e2330] shadow-2xl space-y-5 transform transition-transform hover:scale-[1.02]">
              
              <div className="relative h-72 rounded-2xl overflow-hidden bg-slate-900">
                <img 
                  src="/samay_raina_stage.png" 
                  alt="Samay Raina"
                  className="w-full h-full object-cover object-top filter contrast-105 brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13161f] via-transparent to-transparent opacity-80"></div>
                <div className="absolute top-3.5 right-3.5 px-3.5 py-1 bg-black/75 backdrop-blur-md rounded-full text-[11px] font-bold text-white border border-white/15 shadow-sm">
                  @SamayRainaOfficial
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">Samay Raina</h3>
                <p className="text-xs font-semibold text-[#10b981]">Chess Enthusiast • Creator of India's Got Latent</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">LATENT SHOW PASS</p>
                  <p className="text-xl font-extrabold text-white">₹499</p>
                </div>
                <button className="px-6 py-2.5 bg-gradient-to-r from-[#7c3aed] to-[#6366f1] hover:from-[#6d28d9] hover:to-[#4f46e5] text-white font-bold text-xs rounded-full shadow-lg shadow-purple-500/25 transition-all cursor-pointer">
                  Get Pass
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="relative z-10 text-gray-400 text-xs font-medium">
          "Powering next-generation bio links, monetized passes & app security."
        </div>

      </div>

    </div>
  );
};

export default Login;
