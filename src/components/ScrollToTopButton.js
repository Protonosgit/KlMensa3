"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./settings.module.css";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
        if (window.scrollY > 400) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
    };

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
          <p>Back to top</p>
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;