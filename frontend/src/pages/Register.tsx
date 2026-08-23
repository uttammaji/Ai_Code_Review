import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Github,
  Key,
  Users,
  Star,
  Fingerprint,
  BadgeCheck
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }

    let strength = 0;
    let feedback = [];

    if (password.length >= 8) {
      strength += 25;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      strength += 25;
    } else {
      feedback.push('Include uppercase and lowercase letters');
    }

    if (/\d/.test(password)) {
      strength += 25;
    } else {
      feedback.push('Include at least one number');
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
      strength += 25;
    } else {
      feedback.push('Include at least one special character');
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback.join(' • '));
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-gray-600';
    if (passwordStrength < 50) return 'bg-rose-400';
    if (passwordStrength < 75) return 'bg-amber-400';
    return 'bg-emerald-400';
  };

  const getStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid developer email');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      await register(name, email, password);
      navigate('/verify-otp');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Create your developer account
            </h2>
          </div>
        </div>
        <p className="text-sm text-gray-400 flex items-center gap-2">
          <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
          Get started with automated AI code reviews and security scans
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-sm text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{typeof error === "string" ? error : JSON.stringify(error)}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <User className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              required
              placeholder="Uttam Maji"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#161b22] border border-[#30363d] rounded-xl pl-11 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Email Address <span className="text-rose-400">*</span>
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
            />
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] rounded-xl pl-11 pr-11 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Confirm Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] rounded-xl pl-11 pr-11 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-[#30363d] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-400 min-w-[40px]">
                {getStrengthText()}
              </span>
            </div>
            {passwordStrength < 100 && (
              <p className="text-[10px] text-gray-500">{passwordFeedback}</p>
            )}
            {passwordStrength === 100 && (
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Great password! All requirements met.
              </p>
            )}
          </div>
        )}

        {/* Password Requirements */}
        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${password.length >= 8 ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-600'}`}>
              {password.length >= 8 ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <div className="w-3 h-3 rounded-full border border-gray-600" />
              )}
            </div>
            <span>Min 8 characters</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-600'}`}>
              {/[a-z]/.test(password) && /[A-Z]/.test(password) ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <div className="w-3 h-3 rounded-full border border-gray-600" />
              )}
            </div>
            <span>Upper & lowercase</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${/\d/.test(password) ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-600'}`}>
              {/\d/.test(password) ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <div className="w-3 h-3 rounded-full border border-gray-600" />
              )}
            </div>
            <span>Contains number</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${/[^a-zA-Z0-9]/.test(password) ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-600'}`}>
              {/[^a-zA-Z0-9]/.test(password) ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <div className="w-3 h-3 rounded-full border border-gray-600" />
              )}
            </div>
            <span>Special character</span>
          </div>
        </div>

        {/* Register Button */}
        <Button
          type="submit"
          loading={loading}
          className="w-full justify-center py-2.5 text-sm font-medium relative overflow-hidden group"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          <span className="relative z-10">Create Account & Verify</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#30363d]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase font-mono tracking-wider">
          <span className="bg-[#0d1117] px-3 text-gray-500">Secure Registration</span>
        </div>
      </div>

      {/* Security Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          256-bit encryption
        </span>
        <span className="w-px h-3 bg-[#30363d]" />
        <span className="flex items-center gap-1.5">
          <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
          SOC2 Compliant
        </span>
        <span className="w-px h-3 bg-[#30363d]" />
        <span className="flex items-center gap-1.5">
          <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
          OTP Verification
        </span>
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-400 pt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
};