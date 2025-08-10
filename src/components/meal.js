"use client";
import Image from "next/image";
import { Star, Bot } from "lucide-react";
import styles from "./mealcard.module.css";
import { useEffect, useState } from "react";
import { getCookie } from "@/app/utils/cookie-monster";
import  veganIcon from "../../public/icons/vegan.svg";
import vegiOpIcon from "../../public/icons/vegi-op.svg";
import veganOpIcon  from "../../public/icons/vegan-op.svg";
import { useModalStore } from "@/app/utils/contextStore";


export default function Meal({ meal, mealIndex, images, comments, settingsCookie }) {

  // State variables
  const { openModal, isOpen } = useModalStore();
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);


  useEffect(() => {
    // Load  bookmarks from cookies
    
    // Calculate the average rating of the meal.
    const sumOfRatings = comments.reduce((acc, curr) => acc + curr.rating, 0);
    const fullSum = sumOfRatings + (meal.rating * meal.rating_amt || 0);
    const fullCount = comments.length + (meal.rating_amt || 0);
    setRating(fullSum / fullCount);
    setRatingCount(fullCount);
  }, [meal]);

  useEffect(() => {
    // Disable page scrolling when the meal popup is open.
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

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

  // Open the meal popup and set url param for back gesture detection
  const requestOpenModal = () => {
    if(isOpen) return;
    window.history.pushState(null, '', window.location.href+"?artid="+meal.artikel_id);
    openModal(meal, comments, images);
  };

  // Render the meal card and popup.
  return (
    <>
      <div
        key={mealIndex}
        className={`${(settingsCookie?.layout === "biglist" || settingsCookie?.layout === "grid") && styles.mealCardListV} ${styles.mealCard}`}
        onClick={() => requestOpenModal()} 
      >

        {/* Meal image */}
        {(images && images.length > 0) ? (
          <Image
            placeholder="blur"
            blurDataURL="/plate_placeholder.png"
            priority={false} loading={"lazy"}
            src={"https://gbxuqreqhbkcxrwfeeig.supabase.co" + images[0]?.image_url} alt="dish-image" title={meal.atextohnezsz1}
            className={`${settingsCookie?.layout === "biglist" && styles.mealImageListV} ${styles.mealImage}`}
            width={1600} height={900} />
        ) : (
          <Image
            priority
            src={meal.image ? "https://www.mensa-kl.de/mimg/" + meal?.image : "/plate_placeholder.png"}
            alt="dish-image" title={meal.atextohnezsz1} 
            className={`${settingsCookie?.layout === "biglist" && styles.mealImageListV} ${styles.mealImage}`}
            width={1600} height={900} />
        )}

        <p className={`${settingsCookie?.layout === "biglist" && styles.mealLocationListV} ${styles.mealLocation}`}>
          {meal?.dpartname}

          {meal?.dpname == "Robotic Kitchen" ? <Bot size={18} className={styles.otherIcon} /> : ""}
          {meal?.vegiOption ? <Image title="Vegetarian option" src={vegiOpIcon} alt="vegan-icon" width={18} height={18} className={styles.otherIcon} /> : ""}
          {meal?.veganOption ? <Image title="Vegan option" src={veganOpIcon} alt="vegan-icon" width={18} height={18} className={styles.otherIcon} /> : ""}
          {meal?.menuekennztext == "V+" ? <Image title="Vegan" src={veganIcon} alt="vegan-icon" width={18} height={18} className={styles.otherIcon} /> : ""}
        </p>

        {/* Meal details */}
        <div className={styles.mealInfo}>
          <div className={styles.mealContextLabels}></div>
          <h4 className={`${(settingsCookie?.layout === "biglist" || settingsCookie?.layout === "grid") && styles.mealTitleListV} ${styles.mealTitle}`}>{(settingsCookie?.shortitle ? meal?.atextohnezsz1 : meal?.titleCombined)}</h4>
          <div className={styles.mealFooter}>
            <span className={styles.mealPrice}>{meal.price && (meal?.price[settingsCookie?.pricecat] || meal?.price?.stu) || meal?.price?.price}</span>
            {renderStarRating()}
          </div>
        </div>
      </div>
    
    </>
  );
}
