"use client";
import Image from "next/image";
import { Star, Bot } from "lucide-react";
import styles from "../app/page.module.css";
import MealPopup from "./detailsModal";
import { useEffect, useState } from "react";
import { getCookie } from "@/app/utils/cookie-monster";
import  veganIcon from "../../public/icons/vegan.svg";
import vegiOpIcon from "../../public/icons/vegi-op.svg";
import veganOpIcon  from "../../public/icons/vegan-op.svg";

export default function Meal({ meal, mealIndex, mealComments, mealImages }) {
  // State variables
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [settings, setSettings] = useState();
  const [images, setImages] = useState(mealImages || []);
  const [comments, setComments] = useState(mealComments || []);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);


  useEffect(() => {
    // Load settings and bookmarks from cookies
    const settingsCookie = getCookie('settings') || null;
    if (settingsCookie) {
      setSettings(JSON.parse(settingsCookie));
    }
    
    // Calculate the average rating of the meal.
    const sumOfRatings = comments.reduce((acc, curr) => acc + curr.rating, 0);
    const fullSum = sumOfRatings + (meal.rating * meal.rating_amt || 0);
    const fullCount = comments.length + (meal.rating_amt || 0);
    setRating(fullSum / fullCount);
    setRatingCount(fullCount);

    // DISABLED because it doesn't work and should be in a component not rendered more than once during load!!
    const urlParams = new URLSearchParams(window.location.search);
    const searchArtId = urlParams.get('artid');
    if (searchArtId && searchArtId === meal.artikel_id.toString() && !selectedMeal) {
      // setSelectedMeal(meal);
    }
  }, [meal]);

  useEffect(() => {
    // Disable page scrolling when the meal popup is open.
    if (selectedMeal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedMeal]);

  // Render star rating for the meal (non-interactive).
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


  // Render the meal card and popup.
  return (
    <>
      <div
        key={mealIndex}
        className={styles.mealCard}
        onClick={() => setSelectedMeal(meal)}
      >

        {/* Meal image */}
        {(images && images.length > 0) ? (
          <Image
            placeholder="blur"
            blurDataURL="/plate_placeholder.png"
            priority={false} loading={"lazy"}
            src={"https://gbxuqreqhbkcxrwfeeig.supabase.co" + images[0]?.image_url} alt="dish-image" title={meal.atextohnezsz1}
            className={styles.mealImage}
            width={300} height={200} />
        ) : (
          <Image
            priority
            src={meal.image ? "https://www.mensa-kl.de/mimg/" + meal?.image : "/plate_placeholder.png"}
            alt="dish-image" title={meal.atextohnezsz1} className={styles.mealImage}
            width={300} height={200} />
        )}

        <p className={styles.mealLocation}>
          {meal?.dpartname}

          {meal?.dpname == "Robotic Kitchen" ? <Bot size={18} className={styles.otherIcon} /> : ""}
          {meal?.vegiOption ? <Image title="Vegetarian option" src={vegiOpIcon} alt="vegan-icon" width={18} height={18} className={styles.otherIcon} /> : ""}
          {meal?.veganOption ? <Image title="Vegan option" src={veganOpIcon} alt="vegan-icon" width={18} height={18} className={styles.otherIcon} /> : ""}
          {meal?.menuekennztext == "V+" ? <Image title="Vegan" src={veganIcon} alt="vegan-icon" width={18} height={18} className={styles.otherIcon} /> : ""}
        </p>

        {/* Meal details */}
        <div className={styles.mealInfo}>
          <div className={styles.mealContextLabels}></div>
          <h4 className={styles.mealTitle}>{(settings?.shortitle ? meal?.atextohnezsz1 : meal?.titleCombined)}</h4>
          <div className={styles.mealFooter}>
            <span className={styles.mealPrice}>{(meal?.price[settings?.pricecat] || meal?.price?.stu) || meal?.price?.price}</span>
            {renderStarRating()}
          </div>
        </div>
      </div>

      {/* Meal popup */}
      {selectedMeal && (
        <MealPopup meal={selectedMeal} comments={comments} setComments={setComments} images={images} setImages={setImages} onClose={() => setSelectedMeal(null)} />
      )}
    </>
  );
}
