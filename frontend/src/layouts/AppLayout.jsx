import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ActivityBar } from '../components/layout/ActivityBar';
import { Sidebar } from '../components/layout/Sidebar';
import { TopToolbar } from '../components/layout/TopToolbar';
import { StatusBar } from '../components/layout/StatusBar';
import { BottomPanel } from '../components/layout/BottomPanel';
import { CommandPalette } from '../components/layout/CommandPalette';
import { ToastContainer } from '../components/common/Toast';
import { MonacoDiffViewer } from '../components/editor/MonacoDiffViewer';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useProjectStore } from '../store/projectStore';
import { useUIStore } from '../store/uiStore';

export const AppLayout = () => {
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projRepo, setProjRepo] = useState('');
  const [projBranch, setProjBranch] = useState('main');
  const [projLang, setProjLang] = useState('JavaScript');
  
  const { createProject, loading } = useProjectStore();
  const { addNotification, sidebarOpen, toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projName.trim()) return;

    try {
      const newProj = await createProject({
        name: projName,
        description: projDesc,
        repository: projRepo || `workspace/${projName.toLowerCase().replace(/\s+/g, '-')}`,
        branch: projBranch,
        language: projLang
      });

      addNotification({
        title: 'Project Created',
        message: `Successfully created project ${newProj.name}`,
        type: 'success'
      });

      setNewProjectModalOpen(false);
      setProjName('');
      setProjDesc('');
      setProjRepo('');
      navigate(`/projects/${newProj.id}`);
    } catch {
      addNotification({
        title: 'Error',
        message: 'Failed to create project',
        type: 'error'
      });
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0d1117] text-gray-200 flex flex-col font-sans select-none">
      {/* Top Header Workspace Bar */}
      <TopToolbar onNewProjectClick={() => setNewProjectModalOpen(true)} />

      {/* Main Workspace Body */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Left Activity Bar */}
        <ActivityBar />

        {/* Dynamic Second Sidebar */}
        <Sidebar onNewProjectClick={() => setNewProjectModalOpen(true)} />

        {/* Backdrop for Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 md:hidden"
          />
        )}

        {/* Central Workspace Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0d1117] relative overflow-hidden">
          <div className="flex-1 overflow-hidden flex flex-col relative">
            <Outlet />
          </div>

          {/* Bottom Terminal & Problems Panel */}
          <BottomPanel />
        </main>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar />

      {/* Command Palette Modal */}
      <CommandPalette onNewProjectClick={() => setNewProjectModalOpen(true)} />

      {/* Monaco Diff Viewer Modal */}
      <MonacoDiffViewer />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Create Project Modal */}
      <Modal
        isOpen={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-bold mb-1.5">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Authentication Service"
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              className="w-full bg-[#161b22] border border-white/10 rounded-xl p-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1.5">Description</label>
            <input
              type="text"
              placeholder="Short description of repository"
              value={projDesc}
              onChange={(e) => setProjDesc(e.target.value)}
              className="w-full bg-[#161b22] border border-white/10 rounded-xl p-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-bold mb-1.5">Repository Path</label>
              <input
                type="text"
                placeholder="org/repository-name"
                value={projRepo}
                onChange={(e) => setProjRepo(e.target.value)}
                className="w-full bg-[#161b22] border border-white/10 rounded-xl p-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1.5">Default Branch</label>
              <input
                type="text"
                value={projBranch}
                onChange={(e) => setProjBranch(e.target.value)}
                className="w-full bg-[#161b22] border border-white/10 rounded-xl p-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1.5">Primary Language</label>
            <select
              value={projLang}
              onChange={(e) => setProjLang(e.target.value)}
              className="w-full bg-[#161b22] border border-white/10 rounded-xl p-2.5 text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python</option>
              <option value="Go">Go</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
            </select>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setNewProjectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppLayout;
