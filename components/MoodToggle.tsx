'use client'
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion"; // Import motion

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={{ opacity: 1, scale: 1, rotate: 0 }} // Initial state
        animate={{ 
          opacity: theme === "light" ? 1 : 0, 
          scale: theme === "light" ? 1 : 1.5, 
          rotate: theme === "light" ? 0 : 180 
        }} // Animate based on theme
        transition={{ 
          duration: 0.6, 
          ease: "easeInOut", 
          type: "spring", 
          stiffness: 300 
        }} 
      >
        <Sun className="transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0,  rotate: 180 }} // Initial state
        animate={{ 
          opacity: theme === "light" ? 0 : 1, 
          scale: theme === "light" ? 0.5 : 1.5, 
          rotate: theme === "light" ? 180 : 0 
        }} // Animate based on theme
        transition={{ 
          duration: 0.6, 
          ease: "easeInOut", 
          type: "spring", 
          stiffness: 300 
        }} // Transition with spring effect
        className="absolute"
      >
        <Moon size={20} className="transition-transform duration-300 dark:rotate-0" />
      </motion.div>
    </Button>
  );
}
