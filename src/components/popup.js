import Image from "next/image";
import styles from "./popup.module.css";
import { extractDifferences } from "@/app/utils/stringtools";
import { Star } from "lucide-react";

export default function MealPopup({ meal, onClose }) {
  const additives = extractDifferences(meal.title_with_additives, meal.title);

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
    <div className={styles.popupOverlay} onClick={onClose}>
    <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
      <div className={styles.popupImageContainer}>
        <Image src={meal.image? "https://www.mensa-kl.de/mimg/"+meal.image : "/plate_placeholder.png"} alt={meal.title_with_additives} width={600} height={400} className={styles.popupImage} />
        <button onClick={onClose} className={styles.popupCloseButton}>
          ×
        </button>
      </div>
      <div className={styles.popupDetails}>
        <h2 className={styles.popupTitle}>{meal.title}</h2>
        <p className={styles.popupLocation}>{meal.loc_clearname}</p>
        <div className={styles.popupPriceRating}>
          <span className={styles.popupPrice}>{meal.price} €</span>
          <div className={styles.popupRating}>
          {renderStarRating(meal)}
            {/* <span className={styles.ratingValue}> {meal.rating_amt}</span> */}
          </div>
        </div>
        <p className={styles.popupDescription}><b>Additives:</b> {additives}</p>
        <div className={styles.commentInfo}>
          <p>Comments disabled</p>
        </div>
      </div>
    </div>
  </div>
  )
}