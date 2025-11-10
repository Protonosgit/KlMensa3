"use client";
import { useState } from "react";
import styles from "../styles/details.module.css";
import { Star } from "lucide-react";

export default function StarRating({ disabled = false, starsSet, commonRating = 0, submittedRating, setSubmittedRating }) {
  const [hovered, setHovered] = useState(null);

  const handleClick = (index) => {
    if (disabled) return;
    setSubmittedRating(index);
    if (starsSet) starsSet(index);
  };

  const getClass = (index) => {
    const baseClass = index <= commonRating ? `${styles.star} ${styles.predefined}` : styles.star;

    if (hovered !== null) {
      // On hover → black
      return index <= hovered ? `${baseClass} ${styles.active}` : baseClass;
    }

    if (submittedRating !== null) {
      // After user selects → always black
      return index <= submittedRating ? `${baseClass} ${styles.active}` : baseClass;
    }

    return baseClass;
  };

  return (
    <div className={`${styles.starRating} ${disabled ? styles.disabled : ""}`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          className={getClass(index)}
          onMouseEnter={() => !disabled && setHovered(index)}
          onMouseLeave={() => !disabled && setHovered(null)}
          onClick={() => handleClick(index)}/>
      ))}
    </div>
  );
}
