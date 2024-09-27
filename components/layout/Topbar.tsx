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
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionValue, useTransform, animate } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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

  const topRoutes = [
    { label: "Instructor", path: "/instructor/courses" },
  ];

  const sidebarRoutes = [
    { label: "Courses", path: "/instructor/courses" },
    {
      label: "Performance",
      path: "/instructor/performance",
    },
  ];

  const links = [
    {
      href: "/mwaead",
      key: "/mwaead",
      icon: <TimerIcon className="h-4 w-4" />,
      label: "mwaead",
    },
    
  ];

  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 15) {
      setSearchInput(value);
    }
  };

  const handleSearch = async () => {
    if (searchInput.trim() !== "") {
      setIsLoading(true);
      try {
        // Simulate API call with setTimeout
        await new Promise(resolve => setTimeout(resolve, 400));
        router.push(`/search?query=${searchInput}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const width = useMotionValue(40);
  const padding = useTransform(width, [40, 300], [0, 16]);

  const expandSearch = () => {
    setIsExpanded(true);
    animate(width, 300);
  };

  const collapseSearch = () => {
    if (searchInput === "") {
      setIsExpanded(false);
      animate(width, 30);
    }
  };

  return (
    <div className="flex items-center p-4">
      <div className="flex items-center flex-1">
        <Link className="flex justify-center items-center" href="/">
          <Image
            src={`${theme == "dark" ? "/logoD.png" : "/logo.png"}`}
            height={32}
            width={80}
            alt="logo"
            loading="lazy"
            placeholder="blur"
blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
         
          />
        </Link>

        <motion.div 
          className="max-md:hidden flex ml-4 rounded-full overflow-hidden bg-[#9aabbda1]"
          style={{ width }}
        >
          <AnimatePresence>
            {isExpanded && (
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow bg-transparent border-none outline-none text-sm"
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
            className="bg-[#003285] text-white border-none outline-none cursor-pointer p-2 hover:bg-[#003285]/80 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="text-sm font-medium hover:text-[#003285] dark:hover:text-slate-200"
              >
                Development Link
              </Link>
            </motion.div>
          )}
          {isAdmin && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/instructor/courses"
                className="text-sm font-medium dark:hover:text-slate-200 hover:text-[#003285]"
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
                  className="text-sm font-medium hover:text-[#003285] dark:hover:text-slate-200"
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
            <SheetContent className="flex flex-col gap-4 ">
              <div className="flex flex-col gap-4 py-4">
                {isAdmin && (
                  <Link
                    href="/instructor/courses"
                    className="text-sm font-medium hover:text-[#003285] flex justify-between items-center"
                  >
                    Admin
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
                
                <Link
                  href="/mwaead"
                  className="text-sm font-medium hover:text-[#003285] flex justify-between items-center"
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
                      className="text-sm font-medium hover:text-[#003285] flex justify-between items-center"
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
    </div>
  );
};

export default Topbar;