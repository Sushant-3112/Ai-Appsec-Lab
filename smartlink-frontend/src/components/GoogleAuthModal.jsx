import React, { useState, useEffect } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GoogleAuthModal = ({ isOpen, onClose, onAuthenticate }) => {
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showApiKeyConfig, setShowApiKeyConfig] = useState(false);
  const [oauthError, setOauthError] = useState('');
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('google_oauth_api_key') || 
    import.meta.env.VITE_GOOGLE_CLIENT_ID || 
    '747494521695-sbcr3n4067ts43938g3jhvhhe9f9uqh1.apps.googleusercontent.com'
  );
  const [keySavedNotice, setKeySavedNotice] = useState(false);

  // Official React Google OAuth Hooks
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
      setOauthError("Google OAuth authorization failed. Check origin whitelist in Google Cloud Console.");
    }
  });

  if (!isOpen) return null;

  const saveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('google_oauth_api_key', apiKey);
    setKeySavedNotice(true);
    setOauthError('');
    setTimeout(() => {
      setKeySavedNotice(false);
      setShowApiKeyConfig(false);
    }, 1200);
  };

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
        setOauthError(err.response?.data?.message || `Account '${account.email}' not found in system database.`);
      } finally {
        setLoading(false);
      }
    }, 600);
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
        setOauthError(err.response?.data?.message || `Account '${customEmail}' is not registered in the system database.`);
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn font-sans">
      
      {/* Google OAuth Window Card */}
      <div className="bg-[#f0f4f9] sm:bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-200/80 relative text-[#1f1f1f]">
        
        {/* Top Bar: Google G Logo + Title + API Key Status + Close Button */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200/80 bg-white flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
          </div>

          <div className="flex items-center gap-3">
            {/* API Key Config Button */}
            <button
              onClick={() => setShowApiKeyConfig(!showApiKeyConfig)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-full border border-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>🔑</span>
              <span>API Key / Client ID</span>
            </button>

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
        </div>

        {/* API Key Config Banner / Panel */}
        {showApiKeyConfig && (
          <div className="bg-amber-50 border-b border-amber-200 p-5 text-left animate-fadeIn">
            <form onSubmit={saveApiKey} className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🔑</span> Google OAuth 2.0 Client ID / API Key
                </label>
                {keySavedNotice && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Saved!
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="YOUR_CLIENT_ID.apps.googleusercontent.com"
                className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              />
              <div className="flex justify-between items-center pt-1">
                <p className="text-[11px] text-amber-800">
                  Enter your Google Cloud Console OAuth 2.0 Web Client ID here.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowApiKeyConfig(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs cursor-pointer"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Main Body Grid Layout */}
        <div className="p-8 sm:p-12 bg-white">
          
          {/* OAuth Error Alert Banner */}
          {oauthError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-left animate-fadeIn">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-red-800 uppercase flex items-center gap-1.5">
                  ⚠️ Google Authentication Error
                </span>
                <button onClick={() => setOauthError('')} className="text-xs text-red-400 hover:text-red-600 font-bold cursor-pointer">✕</button>
              </div>
              <p className="text-xs font-medium text-red-700 leading-relaxed mt-1">
                {oauthError}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => handleAccountSelect({ name: 'Sushant Sharma', email: 'sushant.sharma@somaiya.edu' })}
                  className="px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Log In as Sushant Sharma (System Account)
                </button>
                <button
                  onClick={() => handleAccountSelect({ name: 'Tanu Sharma', email: 'tanusharma1012207@gmail.com' })}
                  className="px-3.5 py-1.5 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Log In as Tanu Sharma
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-base text-gray-700 font-medium">Authenticating as <span className="text-blue-600 font-bold">{selectedEmail || customEmail || 'Google User'}</span>...</p>
              <p className="text-xs text-gray-400">Verifying Google OAuth 2.0 Credentials with Server</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              
              {/* Left Column: Heading & Subtitle */}
              <div className="md:col-span-5 pr-0 md:pr-4">
                <h2 className="text-3xl sm:text-4xl font-normal text-gray-900 tracking-tight leading-tight mb-3">
                  Choose an account
                </h2>
                <p className="text-sm text-gray-600 font-normal leading-relaxed">
                  to continue to <span className="text-[#1a73e8] font-medium hover:underline cursor-pointer">aiappseclab.auth.google.com</span>
                </p>

                {/* Official Google OAuth Native Button Component */}
                <div className="mt-6">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-left">
                    Official Google OAuth 2.0 Button
                  </p>
                  <div className="flex justify-start">
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
                        setOauthError("Google OAuth Sign-In failed or popup was closed.");
                      }}
                      useOneTap
                      theme="filled_blue"
                      shape="pill"
                      text="continue_with"
                    />
                  </div>
                </div>

                {/* Active Key Indicator */}
                <div className="mt-6 p-3 bg-gray-50 rounded-2xl border border-gray-200/70 text-left">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span>⚡</span> Google Client ID
                  </p>
                  <p className="text-[11px] font-mono text-gray-700 truncate" title={apiKey}>
                    {apiKey}
                  </p>
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

                    {/* Launch Official Google OAuth 2.0 Popup via react-oauth/google */}
                    <button
                      onClick={() => loginWithGoogleOAuth()}
                      className="w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-blue-50/70 border border-blue-100 transition-all text-left text-blue-700 font-medium text-sm cursor-pointer group my-1"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-700 leading-tight">Official Google OAuth Popup</p>
                        <p className="text-[11px] text-blue-500">Launch Official @react-oauth/google Prompt</p>
                      </div>
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

                    {/* Disclaimer Text */}
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

        {/* Footer */}
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
