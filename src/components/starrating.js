"use client";
import { useState } from "react";
import styles from "./details.module.css";
import { Star } from "lucide-react";

export default function StarRating({ disabled = false, starsSet, predefined = 0 }) {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null); // null = no user interaction yet

  const handleClick = (index) => {
    if (disabled) return;
    setSelected(index);
    if (starsSet) starsSet(index);
  };

  const getClass = (index) => {
    if (hovered !== null) {
      // On hover → black
      return index <= hovered ? `${styles.star} ${styles.active}` : styles.star;
    }

    if (selected !== null) {
      // After user selects → always black
      return index <= selected ? `${styles.star} ${styles.active}` : styles.star;
    }

    // Before interaction → predefined stars yellow
    return index <= predefined ? `${styles.star} ${styles.predefined}` : styles.star;
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
