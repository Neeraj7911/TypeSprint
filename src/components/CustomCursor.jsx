import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cursorX = useSpring(0, { stiffness: 1000, damping: 50, mass: 0.5 });
  const cursorY = useSpring(0, { stiffness: 1000, damping: 50, mass: 0.5 });

  const CURSOR_SIZE = 24;

  const interactiveElementsRef = useRef([]);
  const inputElementsRef = useRef([]);
  const modalsRef = useRef([]);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onMouseMove = useCallback(
    ({ clientX, clientY }) => {
      cursorX.set(clientX);
      cursorY.set(clientY);
    },
    [cursorX, cursorY]
  );

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  useEffect(() => {
    if (isMobile) return;

    window.addEventListener("mousemove", onMouseMove);

    const updateInteractiveElements = () => {
      interactiveElementsRef.current.forEach((el) => {
        el.removeEventListener("mouseenter", () => setIsHovering(true));
        el.removeEventListener("mouseleave", () => setIsHovering(false));
      });
      inputElementsRef.current.forEach((el) => {
        el.removeEventListener("focus", () => setIsHidden(true));
        el.removeEventListener("blur", () => setIsHidden(false));
      });

      interactiveElementsRef.current = Array.from(
        document.querySelectorAll(
          "a, button, [role='button'], input, textarea, select, label, [data-interactive], .cursor-pointer, svg, [class*='fa-'], .group:hover *"
        )
      );
      inputElementsRef.current = Array.from(
        document.querySelectorAll(
          "input[type='text'], input[type='email'], input[type='password'], textarea"
        )
      );

      interactiveElementsRef.current.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true));
        el.addEventListener("mouseleave", () => setIsHovering(false));
      });

      inputElementsRef.current.forEach((el) => {
        el.addEventListener("focus", () => setIsHidden(true));
        el.addEventListener("blur", () => setIsHidden(false));
      });
    };

    const debouncedUpdate = debounce(updateInteractiveElements, 100);

    updateInteractiveElements();

    const observer = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.addedNodes.length)) {
        debouncedUpdate();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    modalsRef.current = Array.from(
      document.querySelectorAll("dialog, [role='dialog'], .modal")
    );
    const modalOpen = () => setIsHidden(true);
    const modalClose = () => setIsHidden(false);

    modalsRef.current.forEach((modal) => {
      modal.addEventListener("animationstart", modalOpen);
      modal.addEventListener("animationend", modalClose);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      interactiveElementsRef.current.forEach((el) => {
        el.removeEventListener("mouseenter", () => setIsHovering(true));
        el.removeEventListener("mouseleave", () => setIsHovering(false));
      });
      inputElementsRef.current.forEach((el) => {
        el.removeEventListener("focus", () => setIsHidden(true));
        el.removeEventListener("blur", () => setIsHidden(false));
      });
      modalsRef.current.forEach((modal) => {
        modal.removeEventListener("animationstart", modalOpen);
        modal.removeEventListener("animationend", modalClose);
      });
      observer.disconnect();
    };
  }, [isMobile, onMouseMove]);

  if (isMobile || isHidden) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[15000]"
      style={{
        left: cursorX,
        top: cursorY,
        width: `${CURSOR_SIZE}px`,
        height: `${CURSOR_SIZE}px`,
        transform: "translate(-25%, -25%) rotate(-45deg)", // Tilt like a normal cursor
      }}
      animate={{
        scale: isHovering ? 1.5 : 1, // Bigger on hover
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <svg
        width={CURSOR_SIZE}
        height={CURSOR_SIZE}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-colors duration-200 ${
          isHovering ? "fill-blue-600" : "fill-blue-500"
        } drop-shadow-[0_0_4px_rgba(59,130,246,0.5)] hover:drop-shadow-[0_0_6px_rgba(37,99,235,0.7)]`}
      >
        <path
          d="M3 3L12 21L15 15L21 12L3 3Z" // Adjusted path for a more traditional cursor shape
          stroke="#93C5FD"
          strokeWidth="1.5"
        />
      </svg>
    </motion.div>
  );
};

export default CustomCursor;
