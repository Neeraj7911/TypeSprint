import React, { useState, useEffect, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const cursorX = useSpring(0, { stiffness: 1000, damping: 50 });
  const cursorY = useSpring(0, { stiffness: 1000, damping: 50 });

  const DOT_SIZE = 10; // Matches your .cursor width/height
  const RING_SIZE = 40; // Matches your .cursor-ring width/height
  const OFFSET = RING_SIZE / 2; // Center the ring

  // Check if the screen size indicates a mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onMouseMove = useCallback(
    ({ clientX, clientY }) => {
      cursorX.set(clientX - OFFSET);
      cursorY.set(clientY - OFFSET);
    },
    [cursorX, cursorY]
  );

  useEffect(() => {
    if (isMobile) return; // Skip event listeners on mobile

    window.addEventListener("mousemove", onMouseMove);

    const interactiveElements = document.querySelectorAll(
      "a, button, [role='button'], input[type='text'], textarea, select"
    );
    const mouseEnter = () => setIsHovering(true);
    const mouseLeave = () => setIsHovering(false);

    const inputElements = document.querySelectorAll(
      "input[type='text'], textarea, select"
    );
    const inputFocus = () => setIsHidden(true);
    const inputBlur = () => setIsHidden(false);

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", mouseEnter);
      el.addEventListener("mouseleave", mouseLeave);
    });

    inputElements.forEach((el) => {
      el.addEventListener("focus", inputFocus);
      el.addEventListener("blur", inputBlur);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", mouseEnter);
        el.removeEventListener("mouseleave", mouseLeave);
      });
      inputElements.forEach((el) => {
        el.removeEventListener("focus", inputFocus);
        el.removeEventListener("blur", inputBlur);
      });
    };
  }, [onMouseMove, isMobile]);

  // Don't render the cursor on mobile or when hidden
  if (isMobile || isHidden) {
    return null;
  }

  return (
    <>
      {/* Inner Cursor Dot */}
      <motion.div
        className="fixed w-[10px] h-[10px] rounded-full bg-gradient-to-br from-orange-500 to-blue-500 shadow-[0_0_7px_#f40,0_0_10px_#f40,0_0_21px_#08f] pointer-events-none z-[9999]"
        style={{
          left: cursorX,
          top: cursorY,
          transform: `translate(-${DOT_SIZE / 2}px, -${DOT_SIZE / 2}px)`, // Center dot
        }}
        animate={{
          scale: isHovering ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      />

      {/* Outer Cursor Ring */}
      <motion.div
        className={`fixed w-[40px] h-[40px] border-2 rounded-full pointer-events-none z-[9998] ${
          isHovering
            ? "border-white/80 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            : "border-white/50 bg-transparent shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        }`}
        style={{
          left: cursorX,
          top: cursorY,
          transform: `translate(-${RING_SIZE / 2}px, -${RING_SIZE / 2}px)`, // Center ring
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
      />
    </>
  );
};

export default CustomCursor;
