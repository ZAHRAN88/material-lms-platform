"use client";
import { UserButton } from "@/components/UserButton";
import { useAuth } from '@/lib/AuthContext';
import {
  Bot,
  BotIcon,
  Menu,
  PersonStanding,
  Search,
  TimerIcon,
  Loader2,
  ChevronRight,
} from "lucide-react";
import HomeIcon from "@mui/icons-material/Home";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionValue, useTransform, animate } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { ThemeToggle } from "../MoodToggle";

interface TopbarProps {
  isAdmin: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ isAdmin }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathName = usePathname();
  const { theme } = useTheme();

  const links = useMemo(() => [
    {
      href: "/mwaead",
      key: "/mwaead",
      icon: <TimerIcon className="h-4 w-4" />,
      label: "mwaead",
    },
  ], []);

  const sidebarRoutes = useMemo(() => [
    { label: "Courses", path: "/instructor/courses" },
    { label: "Performance", path: "/instructor/performance" },
  ], []);

  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const width = useMotionValue(40);
  const padding = useTransform(width, [40, 300], [0, 16]);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value.slice(0, 15));
  }, []);

  const handleSearch = useCallback(async () => {
    if (searchInput.trim() !== "") {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 400));
        router.push(`/search?query=${encodeURIComponent(searchInput.trim())}`);
      } finally {
        setIsLoading(false);
      }
    }
  }, [searchInput, router]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  }, [handleSearch]);

  const expandSearch = useCallback(() => {
    setIsExpanded(true);
    animate(width, 300);
  }, []);

  const collapseSearch = useCallback(() => {
    if (searchInput === "") {
      setIsExpanded(false);
      animate(width, 30);
    }
  }, [searchInput]);

  return (
    <nav className="flex items-center p-4  shadow-sm">
      <div className="flex items-center flex-1">
        <Link href="/" className="flex items-center">
          <Image
            src={theme === "dark" ? "/logoD.png" : "/logo.png"}
            height={32}
            width={80}
            alt="logo"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
          />
        </Link>

        <motion.div 
          className="max-md:hidden flex ml-4 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700"
          style={{ width }}
        >
          <AnimatePresence>
            {isExpanded && (
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow bg-transparent border-none outline-none text-sm px-3"
                placeholder="Search (max 15 chars)"
                value={searchInput}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                style={{ padding }}
                disabled={isLoading}
                maxLength={15}
              />
            )}
          </AnimatePresence>
          <motion.button
            className="bg-blue-600 text-white border-none outline-none cursor-pointer p-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={isExpanded ? handleSearch : expandSearch}
            onBlur={collapseSearch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading || (isExpanded && searchInput.trim() === "")}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </motion.button>
        </motion.div>
      </div>

      <div className="flex gap-6 items-center">
        <motion.div className="max-sm:hidden flex gap-6">
          {process.env.NODE_ENV === "development" && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/development"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Development Link
              </Link>
            </motion.div>
          )}
          {isAdmin && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/instructor/courses"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Admin
              </Link>
            </motion.div>
          )}
          {links.map(({ href, key, icon, label }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={href}
                  className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <div className="flex items-center justify-start">
                    {icon && icon}
                    <span className={icon ? "ml-2" : ""}>{label}</span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {user ? (
          <UserButton />
        ) : (
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        )}

        <ThemeToggle />
        <div className="z-20 sm:hidden">
          <Sheet>
            <SheetTrigger className="flex items-center justify-center">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 py-4">
                {isAdmin && (
                  <Link
                    href="/instructor/courses"
                    className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 flex justify-between items-center transition-colors"
                  >
                    Admin
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
                
                <Link
                  href="/mwaead"
                  className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 flex justify-between items-center transition-colors"
                >
                  <div className="flex items-center">
                    <TimerIcon className="w-5 h-5" />
                    <span className="ml-2">mwaead</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {pathName.startsWith("/instructor") && (
                <div className="flex flex-col gap-4">
                  {sidebarRoutes.map((route) => (
                    <Link
                      href={route.path}
                      key={route.path}
                      className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 flex justify-between items-center transition-colors"
                    >
                      {route.label}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;