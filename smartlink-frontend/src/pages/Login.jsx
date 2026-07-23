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
      await googleLogin(token, userPayload);
      setIsGoogleModalOpen(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google Login failed');
    } finally {
      setGoogleLoading(false);
    }
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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans overflow-hidden">
      
      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onAuthenticate={performGoogleLogin}
      />

      {/* Left Column: Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-24 bg-white z-10 min-h-screen">
        <div></div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-base text-gray-500 font-normal">
              Log in to your Ai Appsec lab
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
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-white"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full font-bold text-base transition-all cursor-pointer shadow-2xs mt-2"
            >
              Continue
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative my-7 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative bg-white px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
              OR
            </span>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3.5">
            <button
              type="button"
              disabled={googleLoading}
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full flex justify-center items-center py-3.5 px-6 border border-gray-200 rounded-full bg-white text-sm font-bold text-gray-800 hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full flex justify-center items-center py-3.5 px-6 border border-gray-200 rounded-full bg-white text-sm font-bold text-gray-800 hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-5 h-5 mr-3 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.12-1 .04-2.19.67-2.88 1.47-.62.72-1.16 1.88-1.01 3.01 1.12.09 2.24-.54 2.9-1.36z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Recovery Links */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-sm font-semibold text-[#7c3aed]">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Forgot password?</a>
              <span className="text-gray-300 mx-2">•</span>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Forgot username?</a>
            </p>

            <p className="text-sm font-medium text-gray-500 pt-1">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#7c3aed] font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-400 font-normal">
          <a href="#" className="hover:underline">Cookie preferences</a>
        </div>
      </div>

      {/* Right Column: Hero Art matching user's image */}
      <div className="w-full md:w-1/2 min-h-screen relative flex items-center justify-center overflow-hidden bg-[#1d4ed8]">
        
        {/* Left half blue, right half lime curve wrapper */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 bg-[#1d4ed8]"></div>
          <div className="w-1/2 bg-[#a3e635] rounded-l-[50px]"></div>
        </div>

        {/* Floating elements container */}
        <div className="relative z-10 w-full h-full max-w-lg flex items-center justify-center p-6">
          
          {/* Main Hero Card: Samay Raina */}
          <div className="w-72 sm:w-80 bg-black rounded-3xl overflow-hidden shadow-2xl border border-black/20 relative z-20 transform transition-transform hover:scale-[1.02]">
            <div className="relative h-96 w-full bg-stone-900">
              <img 
                src="https://lh3.googleusercontent.com/a/default-user=s96-c" 
                alt="Samay Raina" 
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[10px] font-black tracking-widest text-[#a3e635] uppercase">SAMAY RAINA</p>
                <h3 className="text-xl font-black text-white leading-tight">India's Got Latent</h3>
              </div>
            </div>
          </div>

          {/* Top Left Floating Video Card */}
          <div className="absolute top-16 left-2 sm:left-6 z-30 bg-[#0f172a]/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700/50 flex items-center gap-3 w-56 backdrop-blur-md">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">India's Got Latent</p>
              <p className="text-[10px] text-slate-400 truncate">@SamayRainaOfficial</p>
              <div className="w-full bg-slate-700 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-red-500 h-full w-2/3"></div>
              </div>
            </div>
          </div>

          {/* Top Right YouTube Badge */}
          <div className="absolute top-12 right-6 sm:right-10 z-30 w-12 h-12 bg-[#ff0000] rounded-full flex items-center justify-center text-white shadow-xl">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>

          {/* Right Netflix Badge */}
          <div className="absolute top-32 right-4 sm:right-8 z-30 w-12 h-12 bg-black rounded-full flex items-center justify-center text-red-600 font-black text-2xl shadow-xl border border-stone-800">
            N
          </div>

          {/* Bottom Left Floating Card: ASICS Gel-Kahana */}
          <div className="absolute bottom-20 left-4 sm:left-8 z-30 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center w-36 text-center transform -rotate-6">
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <span className="text-2xl">👟</span>
            </div>
            <p className="text-[11px] font-black text-gray-900 leading-tight">ASICS Gel-Kahana</p>
          </div>

          {/* Bottom Right Floating Card: LATENT SHOW PASS ₹499 */}
          <div className="absolute bottom-12 right-2 sm:right-6 z-30 bg-[#fffbeb] p-3.5 rounded-3xl shadow-2xl border border-amber-200/60 w-44 transform rotate-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-black shrink-0">
                <img 
                  src="https://lh3.googleusercontent.com/a/default-user=s96-c" 
                  alt="Latent Pass" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[9px] font-bold text-amber-900 uppercase tracking-wider">LATENT SHOW PASS</p>
                <p className="text-base font-black text-gray-900">₹499</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
