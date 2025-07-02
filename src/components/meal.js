"use client";
import Image from "next/image";
import { Star, MoonIcon, Megaphone, Bookmark } from "lucide-react";
import styles from "../app/page.module.css";
import MealPopup from "./detailsModal";
import { useEffect, useState } from "react";

export default function Meal({ meal, mealIndex }) {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("bookmarks"))
        ?.split("=")[1];
      if (cookieValue) {
        const bookmarks = JSON.parse(cookieValue);
        setIsBookmarked(bookmarks.includes(meal.m_id));
      }
  }, [meal]);

    // render stars (non interactive)
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

  // render icons next to location
  const IconPot = (meal) => {
    switch (meal.meal) {
      case "Abend":
        return <MoonIcon size={16} style={{marginRight: '5px'}} />;
      case "AbendVegan":
        return <MoonIcon size={16} style={{marginRight: '5px'}} />;
      case "News":
        return <Megaphone size={18} style={{marginRight: '5px'}} />;
      default:
        return null;
    }
  };

  async function handleBookmark(e) {

    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bookmarks"))
      ?.split("=")[1];
    const bookmarks = cookieValue ? JSON.parse(cookieValue) : [];
    const bookmarkIndex = bookmarks.indexOf(meal.m_id);

    if (bookmarkIndex !== -1) {
      bookmarks.splice(bookmarkIndex, 1); // Remove bookmark if present
    } else {
      bookmarks.push(meal.m_id); // Add bookmark if not present
    }

    document.cookie = `bookmarks=${JSON.stringify(bookmarks)}; path=/`;
    setIsBookmarked(!isBookmarked);
    e.stopPropagation();
  }

  return (
    <>
      <div
        key={mealIndex}
        className={styles.mealCard}
        onClick={() => setSelectedMeal(meal)}
      >
        <div className={styles.bookmarkContainer}>
          <Bookmark size={14} className={styles.bookmark + (isBookmarked ? ' ' + styles.bookmarkActive : '')} onClick={handleBookmark} />
        </div>
      
        <Image src={meal.image? "https://www.mensa-kl.de/mimg/"+meal.image : "/plate_placeholder.png"} alt="dish-image" priority className={styles.mealImage} width={300} height={200} />
        <div className={styles.mealInfo}>
          <p className={styles.mealLocation}>
            {meal.loc_clearname}
          </p>
          <h4 className={styles.mealTitle}>{meal.title}</h4>
          <div className={styles.mealFooter}>
            <span className={styles.mealPrice}>{meal.price} {meal.price && '€'}</span>
            {renderStarRating(meal)}
          </div>
        </div>
      </div>
      {/* Maybe always render this modal */}
      {selectedMeal && (
        <MealPopup meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}
    </>
  );
}
