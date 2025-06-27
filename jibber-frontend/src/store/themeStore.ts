import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeStore = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
};

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
    }),
    {
      name: 'jibber-theme',
    }
  )
);

export default useThemeStore;
