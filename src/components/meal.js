"use client";
import Image from "next/image";
import { Star,Vegan,Megaphone, Bookmark } from "lucide-react";
import styles from "../app/page.module.css";
import MealPopup from "./detailsModal";
import { useEffect, useState } from "react";
import { getCookie } from "@/app/utils/cookie-monster";

export default function Meal({ meal, mealIndex }) {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [settings, setSettings] = useState();
  const [relevantImages, setRelevantImages] = useState(
    // initialImages?.filter(image => {
    //   const imagePrefix = image?.image_name?.split('_')[0];
    //   return imagePrefix === String(meal?.artikel_id).replace(/\./g, "");
    // }) || []
  );
  //const [relevantComments, setRelevantComments] = useState(initialComments.filter(comment => comment.article_id === meal.artikel_id) || []);
  useEffect(() => {
    const settingsCookie = getCookie('settings') || null;
    if(settingsCookie) {
      setSettings(JSON.parse(settingsCookie));
    }
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bookmarks"))
      ?.split("=")[1];
    if (cookieValue) {
      const bookmarks = JSON.parse(cookieValue);
      setIsBookmarked(bookmarks.includes(meal.artikel_id));
    }
  }, [meal]);



  useEffect(() => {
    if (selectedMeal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedMeal]);


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


  async function handleBookmark(e) {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bookmarks"))
      ?.split("=")[1];
    const bookmarks = cookieValue ? JSON.parse(cookieValue) : [];
    const bookmarkIndex = bookmarks.indexOf(meal.artikel_id);

    if (bookmarkIndex !== -1) {
      bookmarks.splice(bookmarkIndex, 1);
    } else {
      bookmarks.push(meal.artikel_id);
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
        <div className={styles.bookmarkContainer} onClick={handleBookmark} >
          <Bookmark size={14} className={styles.bookmark + (isBookmarked ? ' ' + styles.bookmarkActive : '')}/>
        </div>
      
        {/* <Image src={relevantImages[0]?.image_url ? "https://gbxuqreqhbkcxrwfeeig.supabase.co"+relevantImages[0]?.image_url :(meal.image? "https://www.mensa-kl.de/mimg/"+meal?.image : "/plate_placeholder.png")} alt="dish-image" priority className={styles.mealImage} width={300} height={200} /> */}
         <Image src={meal.image? "https://www.mensa-kl.de/mimg/"+meal?.image : "/plate_placeholder.png"} alt="dish-image" priority className={styles.mealImage} width={300} height={200} />
        <div className={styles.mealInfo}>
          <p className={styles.mealLocation}>
            {meal?.menuekennztext=="V+" ? <Vegan size={14} className={styles.veganIcon} /> : ""}
            {meal?.dpartname}
          </p>
          <h4 className={styles.mealTitle}>{(settings?.shortitle ? meal?.dpname : meal?.titleCombined)+(". "+meal.frei1)}</h4>
          <div className={styles.mealFooter}>
            <span className={styles.mealPrice}>{meal?.price}</span>
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
