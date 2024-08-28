'use client'
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <Sun
        className="rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0"
      />
      <Moon
        className="absolute rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100"
      />
    </Button>
  );
}
