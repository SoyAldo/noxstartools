import { create } from 'zustand';

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  activeTool: string | null;
  setActiveTool: (tool: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  activeTool: null,
  setActiveTool: (tool) => set({ activeTool: tool }),
}));
