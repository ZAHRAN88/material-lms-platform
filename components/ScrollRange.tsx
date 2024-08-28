"use client"
import { motion, useScroll, useSpring } from "framer-motion";
const ScrollRange = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  return (
    
    <motion.div
    className="progress-bar dark:bg-slate-400"
    style={{ scaleX: scaleX }}
  />
  )
}

export default ScrollRange
