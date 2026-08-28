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
  Fingerprint
} from 'lucide-react';

export const VerifyOTP = () => {
  const { pendingEmail, verifyOTP, login, demoOtp } = useAuthStore();
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);
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

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
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

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newDigits = pasted.split('');
      setOtpDigits(newDigits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
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
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Invalid or expired verification code.'
      );
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

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const isTimerExpired = timerSeconds <= 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <Fingerprint className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Verify your email
            </h2>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" />
              Sent 6-digit code to{' '}
              <span className="font-semibold text-gray-200 font-mono">{email || 'your email'}</span>
            </p>
          </div>
        </div>
      </div>

      {demoOtp && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-center justify-between font-mono">
          <span>Demo Dev OTP: <strong>{demoOtp}</strong></span>
          <button
            type="button"
            onClick={() => {
              setOtpDigits(demoOtp.split(''));
            }}
            className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded cursor-pointer hover:bg-blue-600"
          >
            Auto Fill
          </button>
        </div>
      )}

      {resendSuccess && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>New verification code sent to your email!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 6 Digit Input Group */}
        <div>
          <label className="block text-xs font-bold text-gray-300 mb-2.5 text-center uppercase tracking-wider">
            Enter 6-digit verification code
          </label>
          <div className="flex items-center justify-center gap-2.5" onPaste={handlePaste}>
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  if (inputRefs.current) inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-12 h-14 text-center text-2xl font-bold font-mono bg-[#161b22] border rounded-xl text-white focus:outline-none focus:ring-2 transition-all ${
                  digit
                    ? 'border-blue-500/60 bg-blue-500/10'
                    : 'border-white/10 focus:border-blue-500'
                } ${error ? 'border-rose-500/60' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Verification Button */}
        <Button
          type="submit"
          loading={isVerifying}
          className="w-full justify-center py-2.5 text-sm font-semibold"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          <span>Verify & Open Workspace</span>
        </Button>
      </form>

      {/* Timer & Resend */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs">
          <Clock className={`w-4 h-4 ${isTimerExpired ? 'text-rose-400' : 'text-gray-500'}`} />
          <span className="text-gray-400">
            Expires in{' '}
            <span className={`font-mono font-bold ${isTimerExpired ? 'text-rose-400' : 'text-blue-400'}`}>
              {formatTimer(timerSeconds)}
            </span>
          </span>
        </div>

        <button
          onClick={handleResend}
          disabled={!isTimerExpired || isResending}
          className={`text-xs font-semibold transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            isTimerExpired && !isResending
              ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 cursor-pointer'
              : 'text-gray-500 cursor-not-allowed'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
          <span>{isResending ? 'Sending...' : 'Resend code'}</span>
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
