import Image from "next/image";
import styles from "./details.module.css";
import { extractAdditives } from "@/app/utils/additives";
import {  MapPin } from "lucide-react";
import StarRating from "./starrating";
import { Badge } from "@/components/ui/badge"


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
      <a href={meal.loc_link} title="Click for directions to location" className={styles.popupLocation}><MapPin size={20} /> {meal.loc_clearname}</a>
        <h2 className={styles.popupTitle} title={meal?.title_with_additives}>{meal.title}</h2>
        <div className={styles.popupPriceRating}>
          <span title="This price is only for students!" className={styles.popupPrice}>{meal.price} {meal.price && '€'}</span>
          <div className={styles.popupRating}>
            <StarRating meal={meal} />
          </div>
        </div>
        {additives.length > 1 && <p className={styles.popupDescription}><b>Additives:</b> {additives.map((additive) => <Badge title={additive} style={{marginRight: '5px'}} key={additive}>{additive}</Badge>)}</p>}
        <div className={styles.commentInfo}>
          <p title="Not implemented yet">Comments disabled</p>
        </div>
      </div>
    </div>
  </div>
  )
}