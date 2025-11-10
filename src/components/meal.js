import Image from "next/image";
import { Star, Bot, Scale, SoupIcon } from "lucide-react";
import styles from "./mealcard.module.css";
import  VeganIcon from "../../public/icons/VeganIcon.svg";
import VeggieOpIcon from "../../public/icons/VeggieOpIcon.svg";
import VeganOpIcon  from "../../public/icons/VeganOpIcon.svg";
import Link from "next/link";

export default function Meal({ meal, mealIndex, settingsCookie }) {



  // Render star rating for the meal (non-interactive).
  const renderStarRating = () => {
    return (
      <div className={styles.starRating}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${styles.star} ${
              i < Math.floor(meal?.rating) ? styles.starFilled : styles.starEmpty
            }`}
          />
        ))}
        <span className={styles.ratingCount}>{meal?.rating_amt || 0}</span>
      </div>
    );
  };


  // Render the meal card and popup.
  return (
      <Link
        key={mealIndex}
        data-layout={settingsCookie?.layout}
        className={styles.mealCard}
        prefetch
        href={`/meal/${meal?.artikel_id}`}
        scroll={false}
      >
        {/* Meal image */}
          <Image
            priority
            fetchPriority="high"
            src={meal?.image ? meal?.imageUrl : "/plate_placeholder.png"}
            alt="dish-image" title={meal.mergedTitle[0]} 
            className={styles.mealImage}
            width={1600} height={900} />

        <p className={styles.mealLocation}>
          {meal?.dpartname}

          {meal?.dpname == "Robotic Kitchen" ? <Bot size={20} className={styles.otherIcon} /> : ""}
          {meal?.dpartname == "Salatbüfett" ? <Scale size={20} className={styles.otherIcon} /> : ""}
          {meal?.dpartname == "Eintopf 1" || meal?.dpartname == "Eintopf 2" ? <SoupIcon size={20} className={styles.otherIcon} /> : ""}
          {meal?.vegiOption ? <VeggieOpIcon className={styles.greenIcon} /> : ""}
          {meal?.veganOption ? <VeganOpIcon className={styles.greenIcon} /> : ""}
          {meal?.menuekennztext == "V+" ? <VeganIcon className={styles.greenIcon}/> : ""}
        </p>

        {/* Meal details */}
        <div className={styles.mealInfo}>
          <div className={styles.mealContextLabels}></div>
          <h4 className={styles.mealTitle}>{(settingsCookie?.shortitle ? meal?.mergedTitle[0] : meal?.mergedTitle.flat())}</h4>
          <div className={styles.mealFooter}>
            <span className={styles.mealPrice}>{meal.price && (meal?.price[settingsCookie?.pricecat] || meal?.price?.stu) || meal?.price?.price}</span>
            {renderStarRating()}
          </div>
        </div>
      </Link>
    
  );
}
