import { create } from 'zustand';

export const useUIStore = create((set) => ({
  activeSection: 'dashboard',
  sidebarOpen: true,
  bottomPanelOpen: true,
  bottomTab: 'problems',
  commandPaletteOpen: false,
  theme: 'dark',
  notifications: [
    {
      id: 'n1',
      title: 'AI Ready',
      message: 'AI Code Review Engine is online with Gemini 2.5 Flash',
      type: 'success',
      time: 'Just now'
    },
    {
      id: 'n2',
      title: 'Workspace Loaded',
      message: 'Default templates loaded for instant code analysis',
      type: 'info',
      time: '1m ago'
    }
  ],

  setActiveSection: (section) => set({ activeSection: section }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleBottomPanel: () => set((state) => ({ bottomPanelOpen: !state.bottomPanelOpen })),
  setBottomTab: (tab) => set({ bottomTab: tab, bottomPanelOpen: true }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  addNotification: (n) =>
    set((state) => ({
      notifications: [
        { id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, ...n, time: 'Just now' },
        ...state.notifications,
      ],
    })),

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== id),
    })),
}));

export default useUIStore;
