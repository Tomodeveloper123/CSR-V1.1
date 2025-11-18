import React, { useState, useEffect, useCallback } from 'react';
import RefreshIcon from './icons/RefreshIcon';
import UserIcon from './icons/UserIcon';
import LockIcon from './icons/LockIcon';
import { authenticateUser } from '../services/database';

interface LoginProps {
  onLoginSuccess: () => void;
}

const generateCaptchaText = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [message, setMessage] = useState<{type: 'error', text: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setCaptchaText(generateCaptchaText());
  }, []);

  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (captcha.toLowerCase() !== captchaText.toLowerCase()) {
      setMessage({ type: 'error', text: 'CAPTCHA tidak sesuai. Silakan coba lagi.'});
      refreshCaptcha();
      setCaptcha('');
      return;
    }
    
    setIsLoading(true);
    const authResult = await authenticateUser(username, password);
    
    if (authResult.success) {
      // No need to set message, just call the success handler
      onLoginSuccess();
    } else {
      setIsLoading(false);
      setMessage({ type: 'error', text: authResult.message });
      refreshCaptcha();
      setCaptcha('');
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Selamat Datang Kembali</h1>
            <p className="mt-2 text-gray-500">Masuk untuk melanjutkan ke CSR Portal</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="relative">
             <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="captcha" className="text-sm font-medium text-gray-700">Verifikasi Anda bukan robot</label>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <div className="w-full bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center py-3 select-none">
                <span className="text-xl sm:text-2xl font-bold tracking-widest text-gray-700" style={{ fontFamily: 'monospace', textDecoration: 'line-through', fontStyle: 'italic' }}>
                  {captchaText}
                </span>
              </div>
              <button type="button" onClick={refreshCaptcha} aria-label="Refresh CAPTCHA" className="p-2 text-gray-600 rounded-full hover:bg-gray-200 hover:text-blue-600 transition-colors disabled:opacity-50 self-center sm:self-auto" disabled={isLoading}>
                <RefreshIcon />
              </button>
            </div>
            <input
              id="captcha"
              name="captcha"
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition"
              placeholder="Masukkan teks di atas"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm text-center ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {message.text}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </button>
          </div>
        </form>
         <p className="text-center text-sm text-gray-500">
            Belum punya akun?{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Daftar
            </a>
        </p>
      </div>
    </div>
  );
};

export default Login;