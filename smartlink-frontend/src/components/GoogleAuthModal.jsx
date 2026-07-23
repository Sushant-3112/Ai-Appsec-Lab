import React, { useState } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GoogleAuthModal = ({ isOpen, onClose, onAuthenticate }) => {
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [oauthError, setOauthError] = useState('');

  // Native Google OAuth trigger hook
  const loginWithGoogleOAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        await onAuthenticate(tokenResponse.access_token);
      } catch (err) {
        setOauthError(err.response?.data?.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Google OAuth Error:", errorResponse);
      setOauthError("Google OAuth error. Please ensure origin is authorized in Google Cloud Console.");
    }
  });

  if (!isOpen) return null;

  const handleAccountSelect = async (account) => {
    setOauthError('');
    setLoading(true);
    setSelectedEmail(account.email);
    setTimeout(async () => {
      try {
        await onAuthenticate('mock_google_token_' + Date.now(), {
          email: account.email,
          name: account.name,
          picture: account.picture
        });
      } catch (err) {
        setOauthError(err.response?.data?.message || `Account '${account.email}' not found in system.`);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail) return;
    setLoading(true);
    const nameFromEmail = customEmail.split('@')[0].replace('.', ' ');
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    
    setTimeout(async () => {
      try {
        await onAuthenticate('mock_google_token_' + Date.now(), {
          email: customEmail,
          name: formattedName,
          picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        });
      } catch (err) {
        setOauthError(err.response?.data?.message || `Account '${customEmail}' is not registered.`);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn font-sans">
      
      {/* Official Google Sign-In Window Card */}
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-200/80 relative text-[#1f1f1f]">
        
        {/* Top Header Bar */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200/80 bg-white">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
          </div>

          <button 
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1.5 transition-colors cursor-pointer hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Body */}
        <div className="p-8 sm:p-12 bg-white">
          
          {oauthError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-left animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-800">⚠️ {oauthError}</span>
                <button onClick={() => setOauthError('')} className="text-xs text-red-400 hover:text-red-600 font-bold cursor-pointer">✕</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#1a73e8] border-t-transparent"></div>
              <p className="text-base text-gray-800 font-medium">Signing in as <span className="text-[#1a73e8] font-bold">{selectedEmail || customEmail || 'Google User'}</span>...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              
              {/* Left Column: Title & Official Button */}
              <div className="md:col-span-5 pr-0 md:pr-4">
                <h2 className="text-3xl sm:text-4xl font-normal text-gray-900 tracking-tight leading-tight mb-3">
                  Choose an account
                </h2>
                <p className="text-sm text-gray-600 font-normal leading-relaxed mb-6">
                  to continue to <span className="text-[#1a73e8] font-medium hover:underline cursor-pointer">aiappseclab.auth.google.com</span>
                </p>

                {/* Prominent Official Google OAuth Login Button */}
                <div className="pt-2">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      setLoading(true);
                      try {
                        const decoded = jwtDecode(credentialResponse.credential);
                        await onAuthenticate(credentialResponse.credential, {
                          email: decoded.email,
                          name: decoded.name,
                          picture: decoded.picture
                        });
                      } catch (err) {
                        setOauthError(err.response?.data?.message || "Google Authentication failed");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    onError={() => {
                      setOauthError("Google OAuth Sign-In failed or popup closed.");
                    }}
                    theme="filled_blue"
                    shape="pill"
                    text="signin_with"
                  />
                </div>
              </div>

              {/* Right Column: Account List */}
              <div className="md:col-span-7 space-y-1">
                
                {showCustomInput ? (
                  <form onSubmit={handleCustomSubmit} className="space-y-4 py-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Enter your Google Email or Phone
                      </label>
                      <input 
                        type="email"
                        required
                        placeholder="your.email@gmail.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowCustomInput(false)}
                        className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-[#1a73e8] hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Launch Official Google Popup Button */}
                    <button
                      onClick={() => loginWithGoogleOAuth()}
                      className="w-full flex items-center gap-3.5 p-3.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 transition-all text-left text-blue-700 font-medium text-sm cursor-pointer group mb-2"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#1a73e8] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-700 leading-tight">Google Sign-In Popup</p>
                        <p className="text-[11px] text-blue-600">Click to open Google Account popup</p>
                      </div>
                    </button>

                    <div className="border-b border-gray-200/80 my-2"></div>

                    {/* Account 1: Tanu Sharma */}
                    <button
                      onClick={() => handleAccountSelect({
                        name: 'Tanu Sharma',
                        email: 'tanusharma1012207@gmail.com',
                        picture: ''
                      })}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-100/80 transition-all text-left group cursor-pointer border border-transparent"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#0f5257] text-white font-medium flex items-center justify-center text-lg shrink-0">
                          T
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 leading-tight">Tanu Sharma</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">tanusharma1012207@gmail.com</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 font-normal pl-2 shrink-0">Signed out</span>
                    </button>

                    <div className="border-b border-gray-200/80 my-1"></div>

                    {/* Account 2: Sushant Sharma */}
                    <button
                      onClick={() => handleAccountSelect({
                        name: 'Sushant Sharma',
                        email: 'sushant.sharma@somaiya.edu',
                        picture: ''
                      })}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-100/80 transition-all text-left group cursor-pointer border border-transparent"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#1a73e8] text-white font-medium flex items-center justify-center text-lg shrink-0">
                          S
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 leading-tight">Sushant Sharma</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">sushant.sharma@somaiya.edu</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 font-normal pl-2 shrink-0">Active</span>
                    </button>

                    <div className="border-b border-gray-200/80 my-1"></div>

                    {/* Use Another Account */}
                    <button
                      onClick={() => setShowCustomInput(true)}
                      className="w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-gray-100/80 transition-all text-left text-gray-800 font-medium text-sm cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 shrink-0 group-hover:border-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-800">Use another account</span>
                    </button>

                    <div className="border-b border-gray-200/80 my-4"></div>

                    {/* Privacy & Terms Disclaimer */}
                    <p className="text-xs text-gray-500 font-normal leading-relaxed pt-1">
                      Before using this app, you can review aiappseclab.auth.google.com’s{' '}
                      <span className="text-[#1a73e8] font-medium hover:underline cursor-pointer">Privacy Policy</span>{' '}
                      and{' '}
                      <span className="text-[#1a73e8] font-medium hover:underline cursor-pointer">Terms of Service</span>.
                    </p>
                  </>
                )}

              </div>
            </div>
          )}
        </div>

        {/* Real-World Google Footer Bar */}
        <div className="bg-[#f0f4f9] px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 gap-3 border-t border-gray-200/60">
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
            <span>English (United States)</span>
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </div>
          <div className="flex gap-6 font-normal">
            <span className="hover:underline cursor-pointer">Help</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Terms</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GoogleAuthModal;
