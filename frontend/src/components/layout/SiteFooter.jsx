import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Heart, Mail, ShieldCheck, Terminal } from 'lucide-react';

export const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0a0e14] text-gray-400">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.5fr_1fr_1fr] md:px-12">
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-2.5 text-white transition-colors hover:text-blue-400">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 font-mono text-xs font-bold text-white shadow-lg shadow-blue-500/20">
              &gt;_
            </span>
            <span className="font-bold tracking-tight text-base">AI CODE REVIEW</span>
          </Link>
          <p className="max-w-sm text-xs leading-relaxed text-gray-400">
            Intelligent automated code reviews for engineering teams. Catch vulnerabilities, optimize performance bottlenecks, and ship with confidence.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="rounded-xl border border-white/10 p-2 text-gray-400 transition-colors hover:border-blue-500 hover:text-white hover:bg-white/5"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="mailto:support@aicodereview.dev"
              aria-label="Contact support"
              className="rounded-xl border border-white/10 p-2 text-gray-400 transition-colors hover:border-blue-500 hover:text-white hover:bg-white/5"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Platform</h2>
          <nav aria-label="Platform links" className="space-y-2.5 text-xs">
            <Link to="/register" className="block text-gray-400 transition-colors hover:text-blue-400">Start Free Review</Link>
            <Link to="/login" className="block text-gray-400 transition-colors hover:text-blue-400">Developer Sign In</Link>
            <Link to="/dashboard" className="block text-gray-400 transition-colors hover:text-blue-400">Dashboard Workspace</Link>
            <Link to="/review" className="block text-gray-400 transition-colors hover:text-blue-400">Online Code Editor</Link>
          </nav>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Security & Engine</h2>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" /> OWASP Top 10 & CWE Detection</li>
            <li className="flex items-center gap-2"><Terminal className="h-4 w-4 text-blue-400 shrink-0" /> Full Monaco IDE Workflow</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-5 text-xs text-gray-500 md:flex-row md:items-center md:justify-between md:px-12">
          <span>© {year} AI Code Review. All rights reserved.</span>
          <span className="flex items-center gap-1">Built with <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> for elite software engineering.</span>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
