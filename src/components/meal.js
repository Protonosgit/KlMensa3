"use client";
import Image from "next/image";
import { Star, MoonIcon } from "lucide-react";
import styles from "../app/page.module.css";
import MealPopup from "./detailsModal";
import { useEffect, useState } from "react";
import { locFilter, protFilter } from '@/app/utils/filter';

export default function Meal({ meal, mealIndex }) {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [filteredOut, setFilteredOut] = useState(false);

  useEffect(() => {

    function getArrayFromCookie(name) {

      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(name))
        ?.split("=")[1];
    
      return cookieValue ? JSON.parse(cookieValue) : null;
    }
    const locOn = locFilter(meal, getArrayFromCookie("location"));
    const protOn = protFilter(meal, getArrayFromCookie("protein"));
    if(!locOn || !protOn) {
      setFilteredOut(true);
    }
    else {
      setFilteredOut(false);
    }

  }, [meal]);

    if(filteredOut) {
      return null;
    }

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
        <span className={styles.ratingCount}>{meal.rating_amt}</span>
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
          <p className={styles.mealLocation}>
            {meal.loc === "Abend" || meal.loc === "AbendVegan" ? <MoonIcon size={16} style={{marginRight: '5px'}} /> : null}
            {meal.loc_clearname}
          </p>
          <h4 className={styles.mealTitle}>{meal.title}</h4>
          <div className={styles.mealFooter}>
            <span className={styles.mealPrice}>{meal.price} €</span>
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
