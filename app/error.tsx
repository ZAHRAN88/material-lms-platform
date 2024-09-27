'use client'

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const router = useRouter();

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-800 p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotate: 0,
        transition: { duration: 0.5 }
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.8, 
        rotate: 10,
        transition: { duration: 0.5 }
      }}
    >
      <motion.h2 
        className="text-3xl font-bold mb-4"
        animate={{ y: [0, -10, 0], transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" }}}
      >
        Something went wrong!
      </motion.h2>
      <motion.p 
        className="mb-6 text-lg"
        animate={{ scale: [1, 1.05, 1], transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" }}}
      >
        We encountered an unexpected error. Please try again or contact us.
      </motion.p>
      <div className='flex items-center justify-center gap-5'> 
        <Button 
          className='bg-emerald-500/40 hover:bg-emerald-500/60 my-4' 
          onClick={() => {
            router.push("https://wa.link/c55tma");
          }}
        >
          Contact Us
        </Button>  
        <Button
          onClick={reset}
          className="bg-red-600 text-white hover:bg-red-700 transition duration-200"
        >
          Try Again
        </Button>
      </div>
    </motion.div>
  );
}