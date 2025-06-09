import { useEffect } from 'react';
import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import useThemeStore from '@/store/themeStore';

interface ThemeToggleProps {
  className?: string;
}

const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { isDarkMode, setDarkMode } = useThemeStore();

  // Apply dark mode class to html element when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Convert the boolean isDarkMode to string for the toggle
  const selected = isDarkMode ? "dark" : "light";

  return (
    <div className={`relative flex w-fit items-center rounded-full ${className}`}>
      <button
        className={`${TOGGLE_CLASSES} ${selected === "light" ? "text-slate-800" : "text-slate-400"
          } cursor-pointer`}
        onClick={() => setDarkMode(false)}
        aria-label="Light mode"
      >
        <FiSun className="relative z-10 text-md md:text-sm" />
        
      </button>
      <button
        className={`${TOGGLE_CLASSES} ${selected === "dark" ? "text-white" : "text-slate-800"
          } cursor-pointer`}
        onClick={() => setDarkMode(true)}
        aria-label="Dark mode"
      >
        <FiMoon className="relative z-10 text-md md:text-sm" />
        
      </button>
      <div
        className={`absolute inset-0 z-0 flex ${selected === "dark" ? "justify-end" : "justify-start"
          }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", damping: 15, stiffness: 250 }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#5e63f9] to-[#7c7fff]"
        />
      </div>
    </div>
  );
}