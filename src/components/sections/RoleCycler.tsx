"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function RoleCycler({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % roles.length);
    }, 2400);
    return () => clearInterval(id);
  }, [roles.length]);

  return (
    <span className="relative block w-full">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="block text-balance text-accent"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
