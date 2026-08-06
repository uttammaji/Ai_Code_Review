import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Settings as SettingsIcon,
  Shield,
  Sparkles,
  Moon,
  Lock,
  User,
  Sun,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Zap,
  Cpu,
  Code2,
  GitBranch,
  Bell,
  BellOff,
  Mail,
  Key,
  Fingerprint,
  Globe,
  Database,
  Cloud,
  Terminal,
  RefreshCw,
  Save,
  X,
  ChevronRight,
  Palette,
  Sliders,
  Award
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();

  // State for settings
  const [strictness, setStrictness] = useState('HIGH');
  const [secPriority, setSecPriority] = useState('CRITICAL_FIRST');
  const [theme, setTheme] = useState('dark');
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailReports, setEmailReports] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [language, setLanguage] = useState('en');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'ai' | 'security' | 'notifications' | 'integrations'>('general');

  // Settings sections
  const sections = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'ai', label: 'AI Preferences', icon: Sparkles },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Cloud },
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      addNotification({
        title: 'Settings',
        message: 'Preferences updated successfully',
        type: 'success'
      });
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default values?')) {
      setStrictness('HIGH');
      setSecPriority('CRITICAL_FIRST');
      setTheme('dark');
      setAutoSave(true);
      setNotifications(true);
      setEmailReports(true);
      setTwoFactorAuth(false);
      setLanguage('en');
      addNotification({
        title: 'Settings',
        message: 'Settings reset to defaults',
        type: 'info'
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 bg-gradient-to-br from-[#0d1117] via-[#0d1117] to-[#161b22]">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <SettingsIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Settings
                <Badge variant="info" size="sm" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {user?.name || 'Developer'}
                </Badge>
              </h1>
              <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-2">
                <Shield className="w-3 h-3 text-emerald-400" />
                Configure AI review heuristics, security rules, and workspace preferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={handleReset}
              className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d]"
            >
              Reset Defaults
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              onClick={handleSave}
              disabled={saving}
              className={saved ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="p-3 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl">
            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === section.id
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.label}</span>
                    {activeSection === section.id && (
                      <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-[#30363d]">
              <div className="px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Award className="w-3.5 h-3.5" />
                  <span>Version 3.0.1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#30363d]">
                <SettingsIcon className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-gray-200">General Preferences</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Workspace Theme
                  </label>
                  <div className="flex gap-3">
                    {[
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'system', label: 'System', icon: Monitor },
                    ].map((themeOption) => {
                      const Icon = themeOption.icon;
                      return (
                        <button
                          key={themeOption.id}
                          onClick={() => setTheme(themeOption.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border transition-all ${theme === themeOption.id
                              ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                              : 'border-[#30363d] bg-[#0d1117] text-gray-400 hover:text-white hover:border-gray-500'
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{themeOption.label}</span>
                          {theme === themeOption.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="en">English (US)</option>
                    <option value="en-uk">English (UK)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                  <div>
                    <span className="text-sm text-gray-200">Auto-save changes</span>
                    <p className="text-xs text-gray-500">Automatically save settings as you change them</p>
                  </div>
                  <button
                    onClick={() => setAutoSave(!autoSave)}
                    className={`relative w-11 h-6 rounded-full transition-all ${autoSave ? 'bg-blue-600' : 'bg-[#30363d]'
                      }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${autoSave ? 'right-0.5' : 'left-0.5'
                      }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Preferences */}
          {activeSection === 'ai' && (
            <div className="p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#30363d]">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-gray-200">AI Code Review Heuristics</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Review Strictness
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'MAXIMUM', label: 'Maximum', desc: 'Zero-tolerance security & AST checks', icon: Shield },
                      { id: 'HIGH', label: 'High', desc: 'Standard production rules (Default)', icon: Zap },
                      { id: 'BALANCED', label: 'Balanced', desc: 'Critical vulnerabilities & performance', icon: Sliders },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setStrictness(option.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${strictness === option.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-[#30363d] bg-[#0d1117] hover:border-gray-500'
                            }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-4 h-4 ${strictness === option.id ? 'text-blue-400' : 'text-gray-500'}`} />
                            <span className={`text-sm font-medium ${strictness === option.id ? 'text-blue-400' : 'text-gray-300'}`}>
                              {option.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{option.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Security Priority
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'CRITICAL_FIRST', label: 'Security First', desc: 'OWASP Top 10 focused', icon: Shield },
                      { id: 'PERFORMANCE_FIRST', label: 'Performance First', desc: 'Optimization focused', icon: Cpu },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setSecPriority(option.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${secPriority === option.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-[#30363d] bg-[#0d1117] hover:border-gray-500'
                            }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-4 h-4 ${secPriority === option.id ? 'text-blue-400' : 'text-gray-500'}`} />
                            <span className={`text-sm font-medium ${secPriority === option.id ? 'text-blue-400' : 'text-gray-300'}`}>
                              {option.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{option.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#30363d]">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-gray-200">Security & Authentication</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                  <div>
                    <span className="text-sm text-gray-200 flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-400" />
                      Two-Factor Authentication
                    </span>
                    <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                    className={`relative w-11 h-6 rounded-full transition-all ${twoFactorAuth ? 'bg-emerald-600' : 'bg-[#30363d]'
                      }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${twoFactorAuth ? 'right-0.5' : 'left-0.5'
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                  <div>
                    <span className="text-sm text-gray-200 flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-purple-400" />
                      Session Management
                    </span>
                    <p className="text-xs text-gray-500">Active sessions: 2 • Last login: 2 hours ago</p>
                  </div>
                  <Button variant="secondary" size="sm" className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d]">
                    Manage
                  </Button>
                </div>

                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-200">Security Recommendations</span>
                      <p className="text-xs text-gray-500 mt-0.5">Enable 2FA to secure your account against unauthorized access</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#30363d]">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-gray-200">Notification Preferences</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                  <div>
                    <span className="text-sm text-gray-200">Push Notifications</span>
                    <p className="text-xs text-gray-500">Receive in-app notifications for review results</p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative w-11 h-6 rounded-full transition-all ${notifications ? 'bg-blue-600' : 'bg-[#30363d]'
                      }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${notifications ? 'right-0.5' : 'left-0.5'
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                  <div>
                    <span className="text-sm text-gray-200 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      Email Reports
                    </span>
                    <p className="text-xs text-gray-500">Weekly summary of AI review results</p>
                  </div>
                  <button
                    onClick={() => setEmailReports(!emailReports)}
                    className={`relative w-11 h-6 rounded-full transition-all ${emailReports ? 'bg-blue-600' : 'bg-[#30363d]'
                      }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${emailReports ? 'right-0.5' : 'left-0.5'
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                  <div>
                    <span className="text-sm text-gray-200 flex items-center gap-2">
                      <BellOff className="w-4 h-4 text-gray-400" />
                      Quiet Hours
                    </span>
                    <p className="text-xs text-gray-500">10:00 PM - 7:00 AM • Silence notifications</p>
                  </div>
                  <Button variant="secondary" size="sm" className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d]">
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeSection === 'integrations' && (
            <div className="p-6 bg-gradient-to-br from-[#161b22] to-[#1c2333] border border-[#30363d] rounded-2xl space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#30363d]">
                <Cloud className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-gray-200">Integrations</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#161b22] rounded-lg border border-[#30363d]">
                      <GitBranch className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-200">GitHub Integration</span>
                      <p className="text-xs text-gray-500">Connected to github.com/org</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#161b22] rounded-lg border border-[#30363d]">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-200">CI/CD Pipeline</span>
                      <p className="text-xs text-gray-500">Configure webhook for automated reviews</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d]">
                    Setup
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#161b22] rounded-lg border border-[#30363d]">
                      <Database className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-200">Data Export</span>
                      <p className="text-xs text-gray-500">Export review data to CSV or JSON</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d]">
                    Export
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};