"use client";
import Image from "next/image";
import { Star, LocateIcon } from "lucide-react";
import styles from "../app/page.module.css";
import MealPopup from "./popup";
import { useState } from "react";

export default function Meal({ meal, mealIndex }) {
  const [selectedMeal, setSelectedMeal] = useState(null);

  const renderStarRating = (meal) => {
    return (
      <div className={styles.starRating}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${styles.star} ${
              i < Math.floor(meal.rating) ? styles.starFilled : styles.starEmpty
            }`}
          />
        ))}
        <span className={styles.ratingCount}>{meal.amt}</span>
      </div>
    );
  };

  return (
    <>
      <div
        key={mealIndex}
        className={styles.mealCard}
        onClick={() => setSelectedMeal(meal)}
      >
        <Image src={meal.image? "https://www.mensa-kl.de/mimg/"+meal.image : "/plate_placeholder.png"} alt="dish-image" className={styles.mealImage} width={600} height={400} />
        <div className={styles.mealInfo}>
          <p className={styles.mealLocation}>{meal.loc_clearname}</p>
          <h4 className={styles.mealTitle}>{meal.title}</h4>
          <div className={styles.mealFooter}>
            <span className={styles.mealPrice}>${meal.price}</span>
            {renderStarRating(meal)}
          </div>
        </div>
      </div>
      {selectedMeal && (
        <MealPopup meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}
    </>
  );
}
