import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GoogleAuthModal from '../components/GoogleAuthModal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const performGoogleLogin = async (token, userPayload = {}) => {
    setGoogleLoading(true);
    setError('');
    try {
      await googleLogin(token, { require_existing: true, ...userPayload });
      setIsGoogleModalOpen(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google Login failed: Account not registered in system');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Direct 1-Click Google Authentication for instant login
  const onGoogleClick = (e) => {
    e.preventDefault();
    if (googleLoading) return;
    performGoogleLogin('mock_google_token_' + Date.now(), {
      email: 'sushant.sharma@somaiya.edu',
      name: 'Sushant Sharma'
    });
  };

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
      
      {/* Left Column: Linktree Style Auth Form */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16">
        
        {/* Top Logo */}
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center text-slate-900 group">
            <span className="font-black text-2xl tracking-tight text-gray-900">Ai Appsec lab</span>
            <span className="font-black text-2xl text-[#10b981] ml-0.5">*</span>
          </Link>
        </div>

        {/* Center Auth Card */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <h1 className="text-4xl sm:text-[44px] font-black text-gray-900 tracking-tight leading-tight mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500 font-medium text-sm mb-8">
            Log in to your Ai Appsec lab
          </p>

          {error && (
            <div className="mb-6 text-red-600 bg-red-50 text-sm p-3.5 rounded-2xl border border-red-100 font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or username"
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400 bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400 bg-white transition-all shadow-2xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-[#e5e5e5] hover:bg-gray-900 hover:text-white text-gray-800 font-bold text-sm rounded-full transition-all cursor-pointer mt-2"
            >
              Continue
            </button>
          </form>

          {/* Divider OR */}
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
              onClick={() => setIsGoogleModalOpen(true)}
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

            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
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

        {/* Footer Link */}
        <div className="pt-4 text-xs text-gray-400 font-medium">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Cookie preferences</a>
        </div>
      </div>

      {/* Right Column: Exact Linktree Layout with Samay Raina, YouTube channel link, Netflix icon & INR ₹ price */}
      <div className="hidden md:flex w-1/2 min-h-screen relative overflow-hidden bg-[#1d4ed8] items-center justify-center p-8 lg:p-12 select-none">
        {/* Royal Blue Base */}
        <div className="absolute inset-0 bg-[#1d4ed8] z-0"></div>

        {/* Lime Green Block */}
        <div className="absolute right-6 top-10 bottom-10 w-[68%] bg-[#c6f135] z-0 rounded-[48px] shadow-2xl"></div>

        {/* Main Composited Collage Container */}
        <div className="relative z-10 w-full max-w-lg h-[580px] flex items-center justify-center">

          {/* Top-Left Floating Video Player Card linking directly to Samay Raina's Official YouTube Channel */}
          <a
            href="https://www.youtube.com/@SamayRainaOfficial"
            target="_blank"
            rel="noreferrer"
            className="absolute top-2 left-0 z-20 bg-black/80 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/20 flex items-center gap-3 transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all group cursor-pointer"
          >
            <div className="w-24 h-16 rounded-xl overflow-hidden relative bg-gray-900 border border-white/10">
              <img src="/samay_raina_stage.png" alt="Samay Raina YouTube" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:scale-110 transition-transform">
                  ▶
                </div>
              </div>
            </div>
            <div className="pr-3">
              <p className="text-white text-xs font-black group-hover:text-red-400 transition-colors">India's Got Latent</p>
              <p className="text-[10px] text-gray-300 font-semibold mt-0.5">@SamayRainaOfficial</p>
              <div className="w-24 h-1.5 bg-white/30 rounded-full mt-1.5 overflow-hidden">
                <div className="w-16 h-full bg-red-500 rounded-full"></div>
              </div>
            </div>
          </a>

          {/* Top-Right Floating YouTube & Netflix Icons (Large Format) */}
          <div className="absolute top-2 right-0 z-20 flex flex-col gap-4">
            {/* YouTube Icon (Larger Format) */}
            <a
              href="https://www.youtube.com/@SamayRainaOfficial"
              target="_blank"
              rel="noreferrer"
              title="Samay Raina YouTube Channel"
              className="w-16 h-16 rounded-full bg-[#ff4500] hover:bg-red-600 hover:scale-110 transition-all flex items-center justify-center shadow-2xl text-white border-2 border-white cursor-pointer"
            >
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            {/* Netflix Icon (Larger Format) */}
            <a
              href="https://www.netflix.com"
              target="_blank"
              rel="noreferrer"
              title="Watch Special on Netflix"
              className="w-16 h-16 rounded-full bg-black hover:bg-gray-900 hover:scale-110 transition-all flex items-center justify-center shadow-2xl text-[#E50914] border-2 border-white cursor-pointer"
            >
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M5.398 0v24h4.152v-10.74l4.984 10.74h4.068V0h-4.152v10.74L9.466 0z"/>
              </svg>
            </a>
          </div>

          {/* Center Samay Raina Image */}
          <div className="relative z-10 w-[290px] h-[440px] rounded-[36px] overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform">
            <img
              src="/samay_raina_stage.png"
              alt="Samay Raina"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-5">
              <p className="text-lime-300 font-extrabold text-xs uppercase tracking-widest">SAMAY RAINA</p>
              <p className="text-white font-black text-xl tracking-tight leading-tight">India's Got Latent</p>
            </div>
          </div>

          {/* Left Side Floating Sneaker Card */}
          <div className="absolute bottom-28 -left-6 z-20 w-36 h-28 transform -rotate-12 hover:rotate-0 transition-transform">
            <div className="w-full h-full bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-gray-100 flex flex-col items-center justify-center">
              <span className="text-3xl">👟</span>
              <span className="text-[10px] font-black text-gray-700 mt-1">ASICS Gel-Kahana</span>
            </div>
          </div>

          {/* Bottom-Right Floating Product Card with Ticket Price in Indian Rupees (₹) */}
          <div className="absolute bottom-2 right-0 z-20 w-44 bg-[#fffef5] rounded-3xl p-3.5 shadow-2xl border border-amber-100/50 transform rotate-2 hover:rotate-0 transition-transform">
            <div className="w-full h-28 rounded-2xl bg-amber-50/50 flex items-center justify-center p-2 border border-amber-100/30 overflow-hidden">
              <img src="/samay_raina_stage.png" alt="Latent Ticket" className="h-full object-cover rounded-xl" />
            </div>
            <div className="mt-3 px-1">
              <p className="text-[11px] font-black text-gray-900 uppercase tracking-wider">LATENT SHOW PASS</p>
              <p className="text-xl font-black text-gray-900 mt-0.5">₹499</p>
            </div>
          </div>

        </div>
      </div>

      <GoogleAuthModal 
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onAuthenticate={performGoogleLogin}
      />
    </div>
  );
};

export default Login;
