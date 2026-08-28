import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl select-none text-xs md:text-sm active:scale-[0.98] cursor-pointer';

  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold border border-white/10 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5',
    secondary:
      'bg-[#161b22] hover:bg-[#1c2333] text-gray-200 border border-white/10 hover:border-blue-500/40 hover:text-white shadow-sm',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white border border-rose-500/30 shadow-md shadow-rose-600/20 hover:-translate-y-0.5',
    ghost:
      'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white',
    outline:
      'border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-300'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs md:text-sm font-medium gap-2',
    lg: 'px-6 py-3 text-sm md:text-base font-semibold gap-2.5'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
