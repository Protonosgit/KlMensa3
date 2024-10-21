import Image from "next/image";
import styles from "./details.module.css";
import { extractAdditives } from "@/app/utils/additives";
import { Star, MapPin } from "lucide-react";
import StarRating from "./starrating";

export default function MealPopup({ meal, onClose }) {
  const additives = extractAdditives(meal.title_with_additives);

  return (
    <div style={{display: meal? "flex" : "none"}} className={styles.popupOverlay} onClick={onClose}>
    <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
      <div className={styles.popupImageContainer}>
        <Image src={meal.image? "https://www.mensa-kl.de/mimg/"+meal.image : "/plate_placeholder.png"} alt={meal.title_with_additives} width={600} height={400} className={styles.popupImage}/>
        <button onClick={onClose} className={styles.popupCloseButton}>
          ×
        </button>
      </div>
      <div className={styles.popupDetails}>
      <a href={meal.loc_link} className={styles.popupLocation}><MapPin size={20} /> {meal.loc_clearname}</a>
        <h2 className={styles.popupTitle} title={meal?.title_with_additives}>{meal.title}</h2>
        <div className={styles.popupPriceRating}>
          <span className={styles.popupPrice}>{meal.price} €</span>
          <div className={styles.popupRating}>
            <StarRating meal={meal} />
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