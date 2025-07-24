"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./settings.module.css";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const toggleVisibility = debounce(() => {
    setIsVisible(window.scrollY > 400);
  }, 200);

  window.addEventListener("scroll", toggleVisibility);
  return () => window.removeEventListener("scroll", toggleVisibility);
}, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      {isVisible && (
        <button
        title="Scroll to top"
          onClick={scrollToTop}
          className={styles.scrollToTopButton}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;