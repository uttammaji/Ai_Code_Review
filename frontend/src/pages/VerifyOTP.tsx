import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';
import {
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Mail,
  Clock,
  AlertCircle,
  Key,
  Lock,
  Fingerprint,
  Eye
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const VerifyOTP: React.FC = () => {
  const { pendingEmail, verifyOTP, login, loading } = useAuthStore();
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const email = pendingEmail || '';

  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newDigits = pasted.split('');
      setOtpDigits(newDigits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    try {
      setError('');
      setIsVerifying(true);
      await verifyOTP(email, fullOtp);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Invalid or expired verification code.');
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timerSeconds > 0) return;

    try {
      setIsResending(true);
      setError('');
      await login(email);
      setTimerSeconds(120);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const isTimerExpired = timerSeconds <= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Fingerprint className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Verify your identity
            </h2>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              We sent a 6-digit code to{' '}
              <span className="font-semibold text-gray-200 font-mono">{email || 'your email'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-2">
        <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-sm text-gray-300">Secure verification</span>
          <p className="text-xs text-gray-500">This code expires in 2 minutes for your security</p>
        </div>
      </div>

      {resendSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-sm text-emerald-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>New verification code sent to your email!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-sm text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 6 Digit Input Group */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
            Enter 6-digit verification code
          </label>
          <div className="flex items-center justify-center gap-3" onPaste={handlePaste}>
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-14 h-16 text-center text-2xl font-bold font-mono bg-[#161b22] border rounded-xl text-white focus:outline-none focus:ring-2 transition-all ${
                  digit
                    ? 'border-blue-500/50 bg-blue-500/5'
                    : 'border-[#30363d] focus:border-blue-500'
                } ${error ? 'border-rose-500/50' : ''}`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Verification Button */}
        <Button
          type="submit"
          loading={isVerifying}
          className="w-full justify-center py-2.5 text-sm font-medium relative overflow-hidden group"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          <span className="relative z-10">Verify & Continue</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
      </form>

      {/* Timer & Resend */}
      <div className="flex items-center justify-between pt-4 border-t border-[#30363d]">
        <div className="flex items-center gap-2 text-sm">
          <Clock className={`w-4 h-4 ${isTimerExpired ? 'text-rose-400' : 'text-gray-500'}`} />
          <span className="text-gray-400">
            Code expires in{' '}
            <span className={`font-mono font-bold ${isTimerExpired ? 'text-rose-400' : 'text-blue-400'}`}>
              {formatTimer(timerSeconds)}
            </span>
          </span>
        </div>

        <button
          onClick={handleResend}
          disabled={!isTimerExpired || isResending}
          className={`text-sm font-medium transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            isTimerExpired && !isResending
              ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'
              : 'text-gray-500 cursor-not-allowed'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
          <span>{isResending ? 'Sending...' : 'Resend code'}</span>
        </button>
      </div>

      {/* Help text */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Key className="w-3 h-3" />
        <span>Didn't receive the code? Check your spam folder</span>
      </div>
    </div>
  );
};