"use client";

import { BarChart4, MonitorPlay, TimerIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar = () => {
  const pathname = usePathname();

  const sidebarRoutes = [
    { icon: <MonitorPlay className="mr-2 h-4 w-4" />, label: "Courses", path: "/instructor/courses" },
    { icon: <BarChart4 className="mr-2 h-4 w-4" />, label: "Performance", path: "/instructor/performance" },
    { icon: <TimerIcon className="mr-2 h-4 w-4" />, label: "mwaead", path: "/development" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5, damping: 10, stiffness: 80, type: "spring" }}
      className="hidden sm:block w-64 h-screen"
    >
      <ScrollArea className="h-full py-6 px-3 bg-white rounded-lg shadow-md dark:bg-slate-800">
        <div className="space-y-4 py-4">
          {sidebarRoutes.map((route, index) => (
            <motion.div
              key={route.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Button
                asChild
                variant={pathname.startsWith(route.path) ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Link href={route.path}>
                  {route.icon}
                  {route.label}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default Sidebar;
