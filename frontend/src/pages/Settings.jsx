import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { Button } from '../components/common/Button';
import {
  Settings as SettingsIcon,
  Shield,
  Bot,
  Bell,
  CheckCircle2,
  Save
} from 'lucide-react';

export const Settings = () => {
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();

  const [strictness, setStrictness] = useState('HIGH');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      addNotification({
        title: 'Settings Saved',
        message: 'Engine configuration and preferences updated.',
        type: 'success'
      });
      setTimeout(() => setSaved(false), 3000);
    }, 600);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 lg:p-8 space-y-6 bg-[#0d1117]">
      {/* Header */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#161b22] to-[#0d1117] border border-white/10 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
            <SettingsIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Configure Google Gemini model versions, OWASP scanning thresholds, and IDE preferences.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Save className="w-4 h-4" />}
          loading={saving}
          onClick={handleSave}
          className="shadow-lg shadow-blue-500/20"
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'ai', label: 'AI Review Engine', icon: Bot },
          { id: 'security', label: 'Security & AST Rules', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'ai' && (
        <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
              Gemini AI Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full md:w-96 bg-[#0d1117] border border-white/10 rounded-xl p-3 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-fast latency, recommended)</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep architectural reasoning)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">
              Review Strictness Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['LOW', 'MEDIUM', 'HIGH'].map((level) => (
                <div
                  key={level}
                  onClick={() => setStrictness(level)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    strictness === level
                      ? 'bg-blue-500/10 border-blue-500 text-white font-bold'
                      : 'bg-[#0d1117] border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs">{level} Strictness</span>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {level === 'HIGH' ? 'Reports all code smells and optimizations' : level === 'MEDIUM' ? 'Standard production rules' : 'Only critical errors'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-4 text-xs">
          <h3 className="font-bold text-sm text-white">OWASP Vulnerability Scans</h3>
          <div className="space-y-2 text-gray-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-blue-500" />
              <span>SQL Injection & Parameterization Checks</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-blue-500" />
              <span>Cross-Site Scripting (XSS) Prevention</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-blue-500" />
              <span>Hardcoded API Keys & JWT Secrets Detection</span>
            </label>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="p-6 bg-[#161b22]/70 border border-white/10 rounded-3xl space-y-4 text-xs">
          <h3 className="font-bold text-sm text-white">Notification Channels</h3>
          <div className="space-y-2 text-gray-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-blue-500" />
              <span>In-app Toast Alerts</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-blue-500" />
              <span>Email Audit Digest on Complete</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
