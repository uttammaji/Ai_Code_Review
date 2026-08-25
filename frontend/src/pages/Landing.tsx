import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Sparkles,
  ShieldCheck,
  Code2,
  GitBranch,
  Terminal,
  Zap,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  Clock,
  Github,
  Play,
  Award,
  Rocket,
  Lock,
  Cpu,
  Layers,
  ChevronRight,
  ExternalLink,
  Heart,
  MessageSquare,
  TrendingUp,
  ChevronDown,
  Menu,
  X,
  Globe,
  Server,
  Database,
  Cloud,
  Braces,
  GitPullRequest,
  Bug,
  Target,
  BarChart3,
  UserCheck,
  Shield,
  MoveRight,
  Sparkle,
  Workflow,
  Bot,
  Brain,
  Monitor,
  Paintbrush,
  Coffee,
  FileCode,
  Coffee as JavaIcon
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { SiteFooter } from '../components/layout/SiteFooter';

export const Landing: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

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
  const handleDashboardAccess = () => {
    isAuthenticated ? navigate('/dashboard') : navigate('/login');
  };

  const features = [
    {
      icon: ShieldCheck,
      title: 'Security Vulnerability Scans',
      description: 'Detect SQL Injections, XSS vectors, hardcoded secrets, and unsafe JWT configurations instantly.',
      color: 'emerald',
      badge: 'Critical',
      gradient: 'from-emerald-500/20 to-teal-500/10'
    },
    {
      icon: Zap,
      title: 'Performance Bottlenecks',
      description: 'Identify O(N²) computational loops, unindexed queries, and redundant React re-renders.',
      color: 'amber',
      badge: 'Optimization',
      gradient: 'from-amber-500/20 to-orange-500/10'
    },
    {
      icon: Code2,
      title: 'AI-Powered Refactoring',
      description: 'Compare original code with AI-suggested refactored diffs and apply fixes with a single click.',
      color: 'blue',
      badge: 'Smart',
      gradient: 'from-blue-500/20 to-indigo-500/10'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'SOC2 compliant, encryption at rest, and audit logging for all code reviews.',
      color: 'purple',
      badge: 'Compliant',
      gradient: 'from-purple-500/20 to-violet-500/10'
    },
    {
      icon: Brain,
      title: 'Advanced AI Models',
      description: 'Custom-trained on millions of open-source repositories and security best practices.',
      color: 'rose',
      badge: 'GPT-4',
      gradient: 'from-rose-500/20 to-pink-500/10'
    },
    {
      icon: Layers,
      title: 'Multi-Language Support',
      description: 'Supports TypeScript, Python, Go, Java, Rust, and 20+ other languages.',
      color: 'cyan',
      badge: '20+',
      gradient: 'from-cyan-500/20 to-sky-500/10'
    }
  ];

  const stats = [
    { value: '98%', label: 'Vulnerability Detection', icon: ShieldCheck, color: 'emerald' },
    { value: '100k+', label: 'Lines of Code Analyzed', icon: Code2, color: 'blue' },
    { value: '15+', label: 'Active Developers', icon: Users, color: 'purple' },
    { value: '4.5', label: 'Average Review Score', icon: Star, color: 'amber' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Engineer at Stripe',
      quote: 'This tool caught a critical SQL injection vulnerability that would have cost us millions. It\'s now part of our CI/CD pipeline.',
      avatar: 'SC',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Tech Lead at Shopify',
      quote: 'The performance insights helped us reduce our API response time by 40%. The refactoring suggestions are incredibly accurate.',
      avatar: 'MR',
      rating: 5
    },
    {
      name: 'Aisha Patel',
      role: 'Principal Developer at GitHub',
      quote: 'Finally, an AI code review tool that actually understands security patterns and provides actionable feedback.',
      avatar: 'AP',
      rating: 5
    }
  ];

  const integrations = [
    { name: 'JavaScript', icon: Braces, color: 'text-yellow-400' },
    { name: 'C++', icon: Code2, color: 'text-blue-400' },
    { name: 'Java', icon: JavaIcon, color: 'text-red-400' },
    { name: 'Node.js', icon: Server, color: 'text-green-400' },
    { name: 'Express', icon: Terminal, color: 'text-gray-300' },
    { name: 'GitHub', icon: Github, color: 'text-white' }
  ];

  const ColorMap = {
    emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-400',
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400',
    rose: 'from-rose-500/10 to-rose-600/5 border-rose-500/20 text-rose-400',
    cyan: 'from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 text-cyan-400'
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] text-gray-200 font-sans flex flex-col overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#0a0e14]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {/* <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-5 h-5 text-white" />
              </div> */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse ring-2 ring-[#0a0e14]"></div>
            </div>
            <span className="font-bold text-white tracking-tight text-lg flex items-center gap-2">
              AI Code Review
              {/* <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                v3.0
              </span> */}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            {['Features', 'Testimonials', 'Integrations', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-400 hover:text-white transition-all duration-300 relative group"
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
                className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
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
                  className="text-gray-300 hover:text-white hover:bg-white/5"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGetStarted}
                  className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                >
                  <span className="relative z-10">Get Started</span>
                  {/* <Sparkles className="w-3.5 h-3.5 ml-1 relative z-10" /> */}
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
          <div className="md:hidden bg-[#0a0e14]/95 backdrop-blur-xl border-b border-white/5 px-4 py-4 space-y-2 animate-slideDown">
            {['Features', 'Testimonials', 'Integrations', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-gray-400 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-white/10 space-y-2">
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
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 md:py-24">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Animated badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400 font-medium animate-pulse group cursor-pointer hover:border-blue-400/40 transition-all">
              {/* <Sparkle className="w-3.5 h-3.5 animate-spin-slow" /> */}
              <span>Now available with GPT-4 and Claude 3.5</span>
              <MoveRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Ship secure, high-performance code with{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent relative">
                AI-powered reviews
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full blur-sm"></div>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              AI Code Review operates as a virtual Senior Staff Engineer inside your IDE,
              performing deep security scans, AST analysis, and performance refactoring.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                // icon={<Rocket className="w-4 h-4" />}
                onClick={handleGetStarted}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-lg px-8 py-4"
              >
                <span className="relative z-10">Start Free Trial</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                className="group text-lg px-8 py-4 border-white/10 hover:border-white/30"
              >
                {/* <Play className="w-4 h-4 mr-2 group-hover:text-blue-400 transition-colors" /> */}
                See Features
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-400">Free for open source</span>
              </span>
              <span className="w-px h-5 bg-white/10 hidden sm:block"></span>
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-400">Enterprise-grade security</span>
              </span>
              <span className="w-px h-5 bg-white/10 hidden sm:block"></span>
              <span className="flex items-center gap-2">
                <Github className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-400">GitHub integration</span>
              </span>
              <span className="w-px h-5 bg-white/10 hidden sm:block"></span>
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-400">4.5/5 Developer Rating</span>
              </span>
            </div>
          </div>

          {/* Enhanced IDE Preview */}
          <div className="relative mt-16 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
            <div className="relative bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden font-mono text-xs shadow-2xl shadow-black/50">
              <div className="bg-gradient-to-r from-[#0d1117] to-[#161b22] px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer" />
                  </div>
                  <span className="ml-1 font-sans font-medium text-gray-400 text-xs">
                    auth.controller.js — AI Code Review Workspace
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500/10 text-emerald-400 px-3 py-0.5 rounded-full font-bold text-[10px] border border-emerald-500/20 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    92/100 Quality Score
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
                <div className="p-6 md:col-span-2 space-y-2 text-gray-300 bg-[#0d1117]">
                  <p><span className="text-purple-400">exports</span>.<span className="text-yellow-300">verifyOTP</span> = <span className="text-blue-400">async</span> (req, res) =&gt; &#123;</p>
                  <p className="pl-4"><span className="text-purple-400">const</span> &#123; email, otp &#125; = req.body;</p>
                  <p className="pl-4 text-rose-400 bg-rose-950/30 p-3 rounded-lg border-l-2 border-rose-500 relative">
                    <span className="text-gray-500">32 | </span>
                    <span className="text-purple-400">const</span> query = `SELECT * FROM users WHERE email = '<span className="text-amber-300">${`email`}</span>'`;
                    <span className="ml-2 inline-flex items-center gap-1 bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full text-[9px] font-bold animate-pulse">
                      <ShieldCheck className="w-3 h-3" />
                      CRITICAL: SQL Injection
                    </span>
                  </p>
                  <p className="pl-4"><span className="text-purple-400">const</span> token = jwt.sign(&#123; id &#125;, SECRET, &#123; expiresIn: <span className="text-amber-300">'15m'</span> &#125;);</p>
                  <p className="pl-4">res.<span className="text-yellow-300">json</span>(&#123; token &#125;);</p>
                  <p>&#125;;</p>
                </div>

                <div className="p-6 bg-[#0d1117] space-y-4 font-sans">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>SQL INJECTION DETECTED</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    User input is directly concatenated into dynamic SQL string.
                    Attackers can dump sensitive user records and compromise your database.
                  </p>
                  <div className="p-3 bg-[#0a0e14] border border-white/5 rounded-lg font-mono text-[10px] group transition-all hover:border-emerald-400/30">
                    <span className="text-emerald-400 font-bold">+ </span>
                    <span className="text-gray-300">const query = 'SELECT * FROM users WHERE email = $1';</span>
                    <div className="mt-1 text-emerald-400/60 text-[8px]">✓ Parameterized query suggested</div>
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-xs font-medium hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40">
                    Apply Fix
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              const colorMap = {
                emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
                blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
                purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
                amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20'
              };
              return (
                <div 
                  key={idx} 
                  className="group p-6 bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 rounded-2xl text-center hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30"
                >
                  <div className={`inline-flex p-3 rounded-xl ${colorMap[stat.color as keyof typeof colorMap]} border mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-14">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400 font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Features
            </div> */}
            <h2 className="text-4xl font-bold text-white">Why developers love AI Code Review</h2>
            <p className="text-gray-400 mt-2">Powered by advanced AI models trained on millions of codebases</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const colorClass = ColorMap[feature.color as keyof typeof ColorMap];
              return (
                <div
                  key={idx}
                  className="group p-7 bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 rounded-2xl hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30 relative overflow-hidden"
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClass} border group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 bg-[#0a0e14] px-2 py-0.5 rounded-full border border-white/5">
                        {feature.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                    {hoveredFeature === idx && (
                      <div className="mt-4 flex items-center gap-1 text-xs text-blue-400 animate-slideUp">
                        <span>Learn more</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Integrations Section - Only JavaScript, C++, Java, Node.js, Express, GitHub */}
        <section id="integrations" className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-14">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-400 font-medium mb-4">
              <Cloud className="w-3.5 h-3.5" />
              Integrations
            </div> */}
            <h2 className="text-4xl font-bold text-white">Works with your favorite tools</h2>
            <p className="text-gray-400 mt-2">Seamless integration with your development workflow</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {integrations.map((integration, idx) => {
              const Icon = integration.icon;
              return (
                <div 
                  key={idx} 
                  className="group p-5 bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 rounded-xl text-center hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30 cursor-pointer"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Icon className={`w-8 h-8 mx-auto ${integration.color} group-hover:scale-110 transition-transform duration-300`} />
                    <span className="text-xs text-gray-400 mt-3 block group-hover:text-white transition-colors">{integration.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-14">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400 font-medium mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              Testimonials
            </div> */}
            <h2 className="text-4xl font-bold text-white">Trusted by engineering teams worldwide</h2>
            <p className="text-gray-400 mt-2">See what developers are saying about AI Code Review</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx} 
                className="group p-7 bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 rounded-2xl hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">"{testimonial.quote}"</p>
                <div className="mt-4 flex text-amber-400 text-xs">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section id="pricing" className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-20">
          <div className="relative overflow-hidden p-10 md:p-16 bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/10 rounded-3xl text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse delay-1000"></div>

            <div className="relative">
              {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-medium mb-6">
                <Rocket className="w-3.5 h-3.5" />
                Get Started Today
              </div> */}
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to ship better code?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                Join thousands of developers who trust AI Code Review to catch vulnerabilities
                before they reach production.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Button
                  variant="primary"
                  size="lg"
                  // icon={<Sparkles className="w-4 h-4" />}
                  onClick={handleGetStarted}
                  className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-lg px-10 py-4"
                >
                  <span className="relative z-10">Start Free Trial</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open('https://github.com', '_blank')}
                  className="group text-lg px-6 py-2 border-white/10 hover:border-white/30"
                >
                  <Github className="w-3 h-3 mr-2 group-hover:text-blue-400 transition-colors" />
                  View on GitHub
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 mt-8">
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span className="text-gray-400">Free for open source projects</span>
                </span>
                <span className="w-px h-4 bg-white/10 hidden sm:block"></span>
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-400">Enterprise plans available</span>
                </span>
                <span className="w-px h-4 bg-white/10 hidden sm:block"></span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-400">30-day money-back guarantee</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};