"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
            
            { duration: 0.5 }
                   }
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
        <motion.div 
        initial={{ opacity: 0, y:50 }}
        animate={{ opacity: 1 }}

        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        whileInView={{y:10}}
        >
        <Link href="/">
          <Button className="mt-6">Go Home</Button>
        </Link>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default NotFound;
