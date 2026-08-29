const { 
  pendingEmail, 
  verifyRegistrationOTP, 
  resendOTP, 
  demoOtp 
} = useAuthStore();

// Handle submit
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
    await verifyRegistrationOTP(email, fullOtp);
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

// Handle resend
const handleResend = async () => {
  if (timerSeconds > 0) return;

  try {
    setIsResending(true);
    setError('');
    await resendOTP(email);
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
