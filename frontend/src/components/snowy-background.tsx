import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function SnowyBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(150)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `translate(-${Math.random() * 50}%, -${
              Math.random() * 50
            }%)`,
          }}
          animate={{
            y: ["0%", "100%", "0%"],
            x: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 20, // Speed of falling
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        ></motion.div>
      ))}
    </div>
  );
}
