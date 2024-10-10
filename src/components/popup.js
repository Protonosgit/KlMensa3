import styles from "./popup.module.css";
import { useState } from "react";

export default function MealPopup({ meal, onClose }) {
  return (
    <div className={styles.popupOverlay}>
    <div className={styles.popupContent}>
      <div className={styles.popupImageContainer}>
        <img src={meal.mimg ? `https://www.mensa-kl.de/mimg/${meal.mimg[0]?._}` : "/plate_placeholder.png"} alt={meal.name} className={styles.popupImage} />
        <button onClick={onClose} className={styles.popupCloseButton}>
          ×
        </button>
      </div>
      <div className={styles.popupDetails}>
        <h2 className={styles.popupTitle}>{meal.title_html}</h2>
        <p className={styles.popupLocation}>{meal.loc[0]?.$?.name}</p>
        <div className={styles.popupPriceRating}>
          <span className={styles.popupPrice}>{meal.$.price} €</span>
          <div className={styles.popupRating}>
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`${styles.star} ${i < Math.floor(meal.rating[0]?._) ? styles.filled : ''}`}>★</span>
            ))}
            <span className={styles.ratingValue}> {meal.rating[0]?.$.amt}</span>
          </div>
        </div>
        <p className={styles.popupDescription}>{'meal.description'}</p>

        <div className={styles.popupDietaryInfo}>
          <h3>Dietary Information:</h3>
          <div className={styles.dietaryTags}>
            {/* {meal.dietaryInfo.map((info, index) => (
              <span key={index} className={styles.dietaryTag}>
                {info}
              </span>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}