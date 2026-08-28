import React from 'react';
import { Outlet } from 'react-router-dom';
import { Terminal, Code2, ShieldCheck } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full bg-[#0d1117] text-gray-200 flex flex-col lg:flex-row font-sans">
      {/* Left visual side: VS Code terminal style branding */}
      <div className="lg:w-1/2 p-8 lg:p-14 bg-[#161b22] border-r border-white/10 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-lg shadow-blue-500/20">
            &gt;_
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight block leading-tight">AI CODE REVIEW</span>
            <span className="text-xs text-blue-400 font-mono">Senior AI Staff Engineer Platform</span>
          </div>
        </div>

        {/* Middle terminal graphic */}
        <div className="my-10 z-10">
          <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-5 font-mono text-xs shadow-2xl space-y-2.5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-gray-500 text-xs ml-2">ai-code-review-cli</span>
            </div>
            <p className="text-blue-400">&gt; ai-review scan --ast --security --owasp</p>
            <p className="text-gray-400">✓ Parsing AST & file dependencies...</p>
            <p className="text-emerald-400">✓ Security scan: 0 critical SQL injections</p>
            <p className="text-amber-400">⚠ Performance: 2 database query bottlenecks detected</p>
            <p className="text-white font-bold">&gt; Overall Code Health: 94/100 (Clean)</p>
          </div>

          <div className="mt-8 space-y-3">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ship better code with automated AI reviews.
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Catch vulnerabilities before production, optimize performance bottlenecks, and get instant senior engineer refactorings.
            </p>
          </div>
        </div>

        {/* Footer features */}
        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-xs text-gray-400 z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>OWASP Top 10</span>
          </div>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>20+ Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400 shrink-0" />
            <span>CLI & Web IDE</span>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="lg:w-1/2 p-6 lg:p-12 flex items-center justify-center bg-[#0d1117]">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
