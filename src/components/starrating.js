"use client";
import styles from "./details.module.css";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function StarRating({ mealRating, disabled, starsSet }) {
    const [hover, setHover] = useState(null);
    const [rating, setRating] = useState(0);

    useEffect(() => {
      setRating(mealRating);
    }, [mealRating]);

    const handleMouseIn = (i) => {
      if (disabled) return;
      setHover(i + 1);
    };

    const handleMouseOut = () => {
      if (disabled) return;
      setHover(0);
    };

    const handleRating = (rating) => {
      if (disabled) return;
      setRating(rating);
      starsSet(rating);
    };

  return (
    <div className={styles.starRating} onMouseEnter={disabled ? undefined : () => setHover(1)} onMouseLeave={disabled ? undefined : () => setHover(0)}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${styles.star} ${ i < rating ? styles.starFilled : (i < hover ? styles.starHover : styles.starEmpty) } ${i < hover && !disabled ? styles.starHover : ""}`}
        style={disabled ? undefined : {height: "1.7rem", width: "1.7rem"}}
        onMouseEnter={disabled ? undefined : () => handleMouseIn(i)}
        onMouseLeave={disabled ? undefined : () => handleMouseOut()}
        onClick={disabled ? undefined : () => handleRating(i + 1)}
      />
    ))}

  </div>
  )
}
