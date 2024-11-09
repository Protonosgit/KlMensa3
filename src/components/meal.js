"use client";
import Image from "next/image";
import { Star, MoonIcon, Megaphone, Bookmark } from "lucide-react";
import styles from "../app/page.module.css";
import MealPopup from "./detailsModal";
import { useEffect, useState } from "react";
import { locFilter, protFilter, addFilter } from '@/app/utils/filter';

export default function Meal({ meal, mealIndex }) {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [filteredOut, setFilteredOut] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Get filter values from cookies
    function getArrayFromCookie(name) {

      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(name))
        ?.split("=")[1];
    
      return cookieValue ? JSON.parse(cookieValue) : null;
    }
    // Check if current meal card does match a filter profile
    // If not it is hidden
    const locOn = locFilter(meal, getArrayFromCookie("location"));
    const protOn = protFilter(meal, getArrayFromCookie("protein"));
    const addon = addFilter(meal, getArrayFromCookie("additive"));
    if(!locOn || !protOn || !addon) {
      setFilteredOut(true);
    }
    else {
      setFilteredOut(false);
      // set bookmark status
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("bookmarks"))
        ?.split("=")[1];
      if (cookieValue) {
        const bookmarks = JSON.parse(cookieValue);
        setIsBookmarked(bookmarks.includes(meal.m_id));
      }
    }

  }, [meal]);

  // show nothing :(
    if(filteredOut) {
      return null;
    }

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
        <Bookmark size={20} className={styles.bookmark + (isBookmarked ? ' ' + styles.bookmarkActive : '')} onClick={handleBookmark} />
        <Image src={meal.image? "https://www.mensa-kl.de/mimg/"+meal.image : "/plate_placeholder.png"} alt="dish-image" priority className={styles.mealImage} width={300} height={200} />
        <div className={styles.mealInfo}>
          <p className={styles.mealLocation}>
            <IconPot meal={meal.loc} />
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
