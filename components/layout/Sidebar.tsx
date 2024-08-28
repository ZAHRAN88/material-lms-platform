"use client";

import { BarChart4, BotIcon, MonitorPlay, TimerIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const Sidebar = () => {
  const pathname = usePathname();

  const sidebarRoutes = [
    { icon: <MonitorPlay />, label: "Courses", path: "/instructor/courses" },
    {
      icon: <BarChart4 />,
      label: "Performance",
      path: "/instructor/performance",
    },

    {
      path: "/mwaead",
      icon: <TimerIcon className="h-4 w-4" />,
      label: "mwaead",
    },
  ];

  return (
    <motion.div
    initial={{ opacity: 0, x: -100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.5,  damping: 10, stiffness: 80, type: "spring" }}
 className="max-sm:hidden flex flex-col h-screen w-64 border-r shadow-md px-3 py-3 rounded-md my-4 gap-4 text-sm font-medium">
      {sidebarRoutes.map((route, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: index * 0.3, duration: 0.5, ease: "easeOut" }}
          key={route.path}
        >
          <motion.div
           whileHover={{ scale: 1.05, color: "#ff6347" }}
           whileTap={{ scale: 0.95 }}
           key={route.path}>
            <Link
              href={route.path}
              key={route.path}
              className={`flex items-center gap-4 p-3 rounded-lg 
          ${
            pathname.startsWith(route.path) &&
            "bg-[#003285] text-white hover:bg-[#003285]/80 "
          }
          `}
            >
              {route.icon} {route.label}
            </Link>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Sidebar;
