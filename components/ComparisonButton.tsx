"use client";

import { motion } from "framer-motion";

interface ComparisonButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  itemKey: string;
  direction?: "left" | "right";
  className?: string;
}

const ComparisonButton = ({
  children,
  onClick,
  itemKey,
  direction = "left",
  className = "",
}: ComparisonButtonProps) => {
  const isLeft = direction === "left";
  const exitDirection = isLeft ? -200 : 200;

  return (
    <motion.button
      onClick={onClick}
      className={`w-2/5 h-24 text-xl whitespace-normal break-words bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors cursor-pointer ${className}`}
      key={itemKey}
      initial={{ opacity: 0, x: 0, scale: 0.3 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          type: "spring",
          duration: 0.4,
          bounce: 0.3,
        },
      }}
      exit={{
        opacity: 0,
        x: exitDirection,
        scale: 0.8,
        transition: {
          duration: 0.2,
          ease: "easeInOut",
        },
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default ComparisonButton;
