"use client";
import Image from "next/image";
import { Star,Vegan,Megaphone, Bookmark } from "lucide-react";
import styles from "../app/page.module.css";
import MealPopup from "./detailsModal";
import { Suspense, useEffect, useState } from "react";
import { getCookie } from "@/app/utils/cookie-monster";

export default function Meal({ meal, mealIndex, mealComments, mealImages }) {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [settings, setSettings] = useState();
  const [images,setImages] = useState(mealImages  || []);
  const [comments, setComments] = useState(mealComments || []);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

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
    const sumOfRatings = comments.reduce((acc, curr) => acc + curr.rating, 0);
    const fullSum = sumOfRatings + (meal.rating*meal.rating_amt || 0);
    const fullCount = comments.length  + (meal.rating_amt || 0);
    setRating(fullSum/fullCount);
    setRatingCount(fullCount);

    const urlParams = new URLSearchParams(window.location.search);
    const searchArtId = urlParams.get('artid');
    if (searchArtId && searchArtId === meal.artikel_id.toString() && !selectedMeal) {
      //setSelectedMeal(meal);
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
  const renderStarRating = () => {
    return (
      <div className={styles.starRating}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${styles.star} ${
              i < Math.floor(rating) ? styles.starFilled : styles.starEmpty
            }`}
          />
        ))}
        <span className={styles.ratingCount}>{ratingCount}</span>
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
        <div className={styles.bookmarkContainer} title="Bookmark" onClick={handleBookmark} >
          <Bookmark size={14} className={styles.bookmark + (isBookmarked ? ' ' + styles.bookmarkActive : '')}/>
        </div>
      
         {(images && images.length > 0) ? (
          <Image 
              placeholder="blur"
              blurDataURL="/plate_placeholder.png"
              priority={false} loading={"lazy"}
              src={"https://gbxuqreqhbkcxrwfeeig.supabase.co"+images[0]?.image_url} alt="dish-image" title={meal.atextohnezsz1}
              className={styles.mealImage}
              width={300} height={200} />
          ) : (
            <Image 
              priority={false} 
              loading={"lazy"} 
              src={meal.image? "https://www.mensa-kl.de/mimg/"+meal?.image : "/plate_placeholder.png"} 
              alt="dish-image" title={meal.atextohnezsz1} className={styles.mealImage} 
              width={300} height={200} />
          )}

        <div className={styles.mealInfo}>
          <p className={styles.mealLocation}>
            {meal?.menuekennztext=="V+" ? <Vegan size={14} className={styles.veganIcon} /> : ""}
            {meal?.dpartname}
          </p>
          <h4 className={styles.mealTitle}>{(settings?.shortitle ? meal?.atextohnezsz1 : meal?.titleCombined+(". "+meal?.frei1+meal?.frei2))}</h4>
          <div className={styles.mealFooter}>
            <span className={styles.mealPrice}>{meal?.price}</span>
            {renderStarRating()}
          </div>
        </div>
      </div>
      {selectedMeal && (
        <MealPopup meal={selectedMeal} comments={comments} setComments={setComments} images={images} setImages={setImages} onClose={() => setSelectedMeal(null)} />
      )}
    </>
  );
}
