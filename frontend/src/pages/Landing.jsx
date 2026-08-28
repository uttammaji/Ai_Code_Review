import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  ShieldCheck,
  Code2,
  Zap,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  Github,
  Lock,
  Layers,
  ChevronRight,
  Menu,
  X,
  Server,
  Braces,
  MoveRight,
  Brain,
  Shield,
  Heart,
  FileCode,
  Coffee
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { SiteFooter } from '../components/layout/SiteFooter';

export const Landing = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = () => navigate('/register');
  const handleSignIn = () => navigate('/login');

  const features = [
    {
      icon: ShieldCheck,
      title: 'Security Vulnerability Scans',
      description: 'Detect SQL Injections, XSS vectors, hardcoded secrets, and unsafe JWT configurations instantly.',
      badge: 'OWASP Top 10',
      gradient: 'from-emerald-500/20 to-teal-500/10',
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
    },
    {
      icon: Zap,
      title: 'Performance Bottlenecks',
      description: 'Identify O(N²) computational loops, unindexed queries, and memory leaks before production.',
      badge: 'Optimization',
      gradient: 'from-amber-500/20 to-orange-500/10',
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/10'
    },
    {
      icon: Code2,
      title: 'AI-Powered Refactoring',
      description: 'Compare original code with AI-suggested refactored diffs and apply fixes with a single click.',
      badge: 'AST Aware',
      gradient: 'from-blue-500/20 to-indigo-500/10',
      color: 'text-blue-400 border-blue-500/20 bg-blue-500/10'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Zero data retention options, encrypted API tunnels, and audit logging for sensitive repositories.',
      badge: 'Enterprise',
      gradient: 'from-purple-500/20 to-violet-500/10',
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/10'
    },
    {
      icon: Brain,
      title: 'Senior Staff Engineer Heuristics',
      description: 'Powered by Google Gemini 2.5 Flash, trained on clean code patterns and architecture best practices.',
      badge: 'Gemini 2.5',
      gradient: 'from-rose-500/20 to-pink-500/10',
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/10'
    },
    {
      icon: Layers,
      title: 'Multi-Language Support',
      description: 'Full Monaco IDE support for JavaScript, TypeScript, Python, Go, Java, C++, Rust, and SQL.',
      badge: '20+ Languages',
      gradient: 'from-cyan-500/20 to-sky-500/10',
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10'
    }
  ];

  const stats = [
    { value: '99.4%', label: 'Vulnerability Detection', icon: ShieldCheck, color: 'emerald' },
    { value: '250k+', label: 'Lines of Code Audited', icon: Code2, color: 'blue' },
    { value: '2.5s', label: 'Average Review Latency', icon: Zap, color: 'amber' },
    { value: '4.9/5', label: 'Developer Satisfaction', icon: Star, color: 'purple' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Staff Security Engineer',
      quote: 'Caught a critical raw SQL query in a production PR before merge. It saved us from a massive data exposure.',
      avatar: 'SC',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Backend Tech Lead',
      quote: 'The performance insights and automatic diff comparisons slashed our PR review cycles by more than 50%.',
      avatar: 'MR',
      rating: 5
    },
    {
      name: 'Aisha Patel',
      role: 'Full Stack Architect',
      quote: 'The cleanest UI for AI reviews. The Monaco Editor integration feels like a native IDE on the web.',
      avatar: 'AP',
      rating: 5
    }
  ];

  const integrations = [
    { name: 'JavaScript', icon: Braces, color: 'text-yellow-400' },
    { name: 'TypeScript', icon: FileCode, color: 'text-blue-400' },
    { name: 'Python', icon: Code2, color: 'text-emerald-400' },
    { name: 'Java', icon: Coffee, color: 'text-amber-500' },
    { name: 'Node.js', icon: Server, color: 'text-green-400' },
    { name: 'GitHub', icon: Github, color: 'text-white' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e14] text-gray-200 font-sans flex flex-col overflow-x-hidden">
      {/* Ambient Animated Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#0a0e14]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {/* <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                &gt;_
              </div> */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse ring-2 ring-[#0a0e14]"></div>
            </div>
            <span className="font-bold text-white tracking-tight text-lg flex items-center gap-2">
              AI Code Review
              {/* <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                PRO
              </span> */}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            {['Features', 'Demo', 'Testimonials', 'Integrations'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-400 hover:text-white transition-all duration-200 relative group font-medium"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignIn}
                  className="text-gray-300 hover:text-white"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGetStarted}
                >
                  <span>Get Started</span>
                </Button>
              </>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0a0e14]/95 backdrop-blur-xl border-b border-white/10 px-4 py-4 space-y-2 animate-fade-in-down">
            {['Features', 'Demo', 'Testimonials', 'Integrations'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            {!isAuthenticated && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <Button variant="ghost" size="sm" onClick={handleSignIn} className="w-full justify-center">
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={handleGetStarted} className="w-full justify-center">
                  Get Started
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 pt-16 relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Animated badge */}
            {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400 font-medium group cursor-pointer hover:border-blue-400/40 transition-all">
              <span>Powered by Gemini 2.5 Flash & OWASP Security AST Engine</span>
              <MoveRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div> */}

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Ship clean, vulnerability-free code with{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                intelligent AI reviews
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Your virtual Senior Staff Engineer in the browser. Instant AST scans, security vulnerability detection, and automated diff refactorings.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleGetStarted}
                className="text-base px-8 py-3.5 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <span>Start Reviewing Free</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => document.querySelector('#demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-base px-8 py-3.5"
              >
                Explore Live Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant Free Tier</span>
              </span>
              <span className="w-px h-4 bg-white/10 hidden sm:block"></span>
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>OWASP Top 10 Scans</span>
              </span>
              <span className="w-px h-4 bg-white/10 hidden sm:block"></span>
              <span className="flex items-center gap-2">
                <Github className="w-4 h-4 text-purple-400" />
                <span>GitHub Repository Sync</span>
              </span>
            </div>
          </div>

          {/* Interactive IDE Preview */}
          <div id="demo" className="relative mt-16 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
            <div className="relative bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden font-mono text-xs shadow-2xl shadow-black/80">
              <div className="bg-[#161b22] px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="ml-2 font-sans font-semibold text-gray-300 text-xs">
                    auth.controller.js — AI Code Review Workspace
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-bold text-[11px] border border-emerald-500/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    94/100 Health Score
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                <div className="p-6 md:col-span-2 space-y-2 text-gray-300 bg-[#0d1117]">
                  <p><span className="text-purple-400">exports</span>.<span className="text-yellow-300">verifyOTP</span> = <span className="text-blue-400">async</span> (req, res) =&gt; &#123;</p>
                  <p className="pl-4"><span className="text-purple-400">const</span> &#123; email, otp &#125; = req.body;</p>
                  <p className="pl-4 text-rose-400 bg-rose-950/40 p-3 rounded-xl border border-rose-800/40 my-2">
                    <span className="text-gray-500">32 | </span>
                    <span className="text-purple-400">const</span> query = `SELECT * FROM users WHERE email = '<span className="text-amber-300">${`email`}</span>'`;
                    <span className="ml-2 inline-flex items-center gap-1 bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      CRITICAL: SQL Injection Risk
                    </span>
                  </p>
                  <p className="pl-4"><span className="text-purple-400">const</span> token = jwt.sign(&#123; id &#125;, SECRET, &#123; expiresIn: <span className="text-amber-300">'7d'</span> &#125;);</p>
                  <p className="pl-4">res.<span className="text-yellow-300">json</span>(&#123; token &#125;);</p>
                  <p>&#125;;</p>
                </div>

                <div className="p-6 bg-[#161b22]/50 space-y-4 font-sans flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-2">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>SQL INJECTION DETECTED</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      User input concatenated directly into dynamic SQL query. Attacker can bypass authentication or extract sensitive tables.
                    </p>
                    <div className="p-3 bg-[#0d1117] border border-white/10 rounded-xl font-mono text-[11px] mt-3">
                      <span className="text-emerald-400 font-bold">+ </span>
                      <span className="text-gray-300">const query = 'SELECT * FROM users WHERE email = $1';</span>
                      <div className="mt-1 text-emerald-400/80 text-[9px]">✓ Parameterized query applied</div>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center shadow-lg"
                    onClick={handleGetStarted}
                  >
                    Try AI Reviewer Free
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="p-6 bg-[#161b22]/80 border border-white/10 rounded-2xl text-center hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-black/40"
                >
                  <div className="inline-flex p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Why engineering teams trust AI Code Review</h2>
            <p className="text-gray-400 mt-2 text-base">Built to replace manual boilerplate reviews with precision AI heuristics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-7 bg-[#161b22]/70 border border-white/10 rounded-2xl hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden"
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex p-3 rounded-xl border ${feature.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                        {feature.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Integrations */}
        <section id="integrations" className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Languages & Toolchains</h2>
            <p className="text-gray-400 mt-2 text-base">Seamless analysis across your multi-stack repositories</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {integrations.map((integration, idx) => {
              const Icon = integration.icon;
              return (
                <div 
                  key={idx} 
                  className="p-5 bg-[#161b22]/70 border border-white/10 rounded-2xl text-center hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <Icon className={`w-8 h-8 mx-auto ${integration.color} mb-3`} />
                  <span className="text-xs font-bold text-gray-300 block">{integration.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Loved by developers worldwide</h2>
            <p className="text-gray-400 mt-2 text-base">Here is what engineers say about our review speed and accuracy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                className="p-7 bg-[#161b22]/70 border border-white/10 rounded-2xl hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">"{t.quote}"</p>
                <div className="mt-4 flex text-amber-400 text-xs gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-20">
          <div className="relative overflow-hidden p-10 md:p-16 bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-white/10 rounded-3xl text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
                Ready to elevate your code quality?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                Start reviewing your files in seconds. No complex setup or credit card required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGetStarted}
                  className="text-base px-10 py-4 shadow-xl shadow-blue-500/30"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => window.open('https://github.com', '_blank')}
                  className="text-base px-8 py-4"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View GitHub
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Landing;
