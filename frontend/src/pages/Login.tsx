import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';
import {
  Mail,
  ArrowRight,
  Github,
  Lock,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Key,
  LogIn,
  User,
  Fingerprint
} from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { login, verifyOTP, loading } = useAuthStore();
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setError('');
      await login(email);
      setShowOTP(true);
      setTimeLeft(300);
      setResendDisabled(true);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to send verification code. Try again.');
    }
  };

  const handleResendOTP = async () => {
    try {
      setError('');
      await login(email);
      setTimeLeft(300);
      setResendDisabled(true);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
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
      await verifyOTP(email, otpString);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
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

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleVerifyOTP();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
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
    <div className="space-y-6">
      {searchParams.get('expired') && (
        <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
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
        <p className="text-sm text-gray-400 mt-1">
          {showOTP
            ? `Enter the 6-digit code sent to ${email}`
            : 'Enter your email to receive a verification code'
          }
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-sm text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!showOTP ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                placeholder="developer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] rounded-xl pl-11 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                autoFocus
              />
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full justify-center py-2.5 text-sm font-medium"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Send Verification Code
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          {/* OTP Inputs */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
              Enter 6-digit code
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}

                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-12 h-14 text-center text-xl font-bold bg-[#161b22] border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    digit ? 'border-blue-500/50 bg-blue-500/5' : 'border-[#30363d]'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Timer and Resend */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-amber-400' : ''}`} />
              <span className={timeLeft < 60 ? 'text-amber-400 font-mono' : 'font-mono'}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-gray-500">remaining</span>
            </div>
            <button
              onClick={handleResendOTP}
              disabled={resendDisabled || loading}
              className={`text-sm font-medium transition-all flex items-center gap-1 ${
                resendDisabled || loading
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-blue-400 hover:text-blue-300 hover:underline'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Resend code
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleVerifyOTP}
              loading={isVerifying}
              className="w-full justify-center py-2.5 text-sm font-medium"
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Verify & Sign In
            </Button>

            <button
              onClick={handleBackToEmail}
              className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors"
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
              <div className="w-full border-t border-[#30363d]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-mono tracking-wider">
              <span className="bg-[#0d1117] px-3 text-gray-500">Secure Access</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock className="w-3.5 h-3.5" />
            <span>Protected by 256-bit encryption</span>
            <span className="w-px h-3 bg-[#30363d]"></span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SOC2 Compliant
            </span>
          </div>

          <p className="text-center text-sm text-gray-400 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:underline font-semibold hover:text-blue-300 transition-colors">
              Create account
            </Link>
          </p>
        </>
      )}
    </div>
  );
};