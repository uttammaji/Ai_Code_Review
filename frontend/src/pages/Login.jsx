import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';
import {
  Mail,
  ArrowRight,
  Lock,
  ShieldCheck,
  Clock,
  AlertCircle,
  RefreshCw,
  LogIn,
  Fingerprint
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  const { loginWithPassword, loginWithOTP, verifyLoginOTP, loading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (showOTP && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setResendDisabled(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showOTP, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setError('');
      
      if (usePassword) {
        // Login with password
        if (!password) {
          setError('Please enter your password');
          return;
        }
        await loginWithPassword(email, password);
        navigate('/dashboard');
        return;
      }

      // Login with OTP
      await loginWithOTP(email);
      setShowOTP(true);
      setTimeLeft(300);
      setResendDisabled(true);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to sign in. Please check credentials or request OTP.'
      );
    }
  };

  const handleResendOTP = async () => {
    try {
      setError('');
      await loginWithOTP(email);
      setTimeLeft(300);
      setResendDisabled(true);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      setError('Failed to resend verification code. Try again.');
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }

    try {
      setError('');
      setIsVerifying(true);
      await verifyLoginOTP(email, otpString);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const pastedValue = value.slice(0, 6);
      const newOtp = [...otp];
      for (let i = 0; i < pastedValue.length && i < 6; i++) {
        newOtp[i] = pastedValue[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pastedValue.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleVerifyOTP();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleBackToEmail = () => {
    setShowOTP(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimeLeft(300);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {searchParams.get('expired') && (
        <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-xs text-amber-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>Your session has expired. Please verify your email to log in again.</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          {showOTP ? (
            <>
              <Fingerprint className="w-5 h-5 text-blue-400" />
              <span>Verify your identity</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5 text-blue-400" />
              <span>Welcome back</span>
            </>
          )}
        </h2>
        <p className="text-sm text-gray-400 mt-1.5">
          {showOTP
            ? `Enter the 6-digit code sent to ${email}`
            : 'Sign in to access your code review workspace and analytics'}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-2xl text-xs text-rose-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!showOTP ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                placeholder="developer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161b22] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                autoFocus
              />
            </div>
          </div>

          {usePassword && (
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#161b22] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setUsePassword(!usePassword);
                setPassword('');
                setError('');
              }}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {usePassword ? 'Use One-Time Code (OTP)' : 'Sign in with Password instead'}
            </button>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full justify-center py-2.5 text-sm font-semibold"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {usePassword ? 'Sign In with Password' : 'Send Verification OTP'}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-3 text-center uppercase tracking-wider">
              Enter 6-digit verification code
            </label>
            <div className="flex gap-2.5 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-12 h-14 text-center text-xl font-bold bg-[#161b22] border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    digit ? 'border-blue-500/60 bg-blue-500/10' : 'border-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className={`w-3.5 h-3.5 ${timeLeft < 60 ? 'text-amber-400' : ''}`} />
              <span className={timeLeft < 60 ? 'text-amber-400 font-mono' : 'font-mono'}>
                {formatTime(timeLeft)}
              </span>
              <span>remaining</span>
            </div>
            <button
              onClick={handleResendOTP}
              disabled={resendDisabled || loading}
              className={`font-semibold transition-all flex items-center gap-1.5 ${
                resendDisabled || loading
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Resend code
            </button>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleVerifyOTP}
              loading={isVerifying}
              className="w-full justify-center py-2.5 text-sm font-semibold"
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Verify & Sign In
            </Button>

            <button
              onClick={handleBackToEmail}
              className="w-full text-center text-xs text-gray-400 hover:text-white transition-colors"
            >
              Change email address
            </button>
          </div>
        </div>
      )}

      {!showOTP && (
        <>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
              <span className="bg-[#0d1117] px-3 text-gray-500">Secure Access</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:underline font-bold hover:text-blue-300 transition-colors">
              Create account
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default Login;
