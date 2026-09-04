"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ isDarkHeader }: { isDarkHeader?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // Placeholder to avoid layout shift
  }

  const iconColor = isDarkHeader ? "rgba(255, 255, 255, 0.8)" : "var(--c-white-80)";
  const hoverBg = isDarkHeader ? "rgba(255, 255, 255, 0.1)" : "var(--c-white-05)";

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
      style={{ backgroundColor: "transparent" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      aria-label="Chuyển đổi giao diện sáng/tối"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" style={{ color: iconColor }} />
      ) : (
        <Moon className="w-5 h-5" style={{ color: iconColor }} />
      )}
    </button>
  );
}
