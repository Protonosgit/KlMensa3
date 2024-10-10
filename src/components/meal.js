"use client";
import Image from "next/image";
import { Star, LocateIcon } from "lucide-react";
import styles from "../app/page.module.css";
import MealPopup from "./popup";
import { useState } from "react";

export default function Meal({ meal, mealIndex }) {
  const [selectedMeal, setSelectedMeal] = useState(null);

  const renderStarRating = (rating) => {
    return (
      <div className={styles.starRating}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${styles.star} ${
              i < Math.floor(rating._) ? styles.starFilled : styles.starEmpty
            }`}
          />
        ))}
        <span className={styles.ratingCount}>{rating.$.amt}</span>
      </div>
    );
  };

  const renderImage = (meal) => {
    if (meal.mimg) {
      return (
        <Image
          src={"https://www.mensa-kl.de/mimg/" + meal.mimg[0]?._}
          alt={"user_provided_image"}
          className={styles.mealImage}
          width={600}
          height={400}
        />
      );
    } else {
      return (
        <Image
          src={"/plate_placeholder.png"}
          alt={"image_not_found"}
          className={styles.mealImage}
          width={600}
          height={400}
        />
      );
    }
  };

  return (
    <>
      <div
        key={mealIndex}
        className={styles.mealCard}
        onClick={() => setSelectedMeal(meal)}
      >
        {renderImage(meal)}
        <div className={styles.mealInfo}>
          <p className={styles.mealLocation}>{meal.loc[0]?.$?.name}</p>
          <h4 className={styles.mealTitle}>{meal.title_html}</h4>
          <div className={styles.mealFooter}>
            <span className={styles.mealPrice}>${meal.$.price}</span>
            {renderStarRating(meal.rating[0])}
          </div>
        </div>
      </div>
      {selectedMeal && (
        <MealPopup meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}
    </>
  );
}
