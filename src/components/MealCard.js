import Image from "next/image";
import { Star, Bot, SoupIcon, SaladIcon } from "lucide-react";
import styles from "./MealCard.module.css";
import  VeganIcon from "../../public/icons/VeganIcon.svg";
import VeggieOpIcon from "../../public/icons/VeggieOpIcon.svg";
import VeganOpIcon  from "../../public/icons/VeganOpIcon.svg";
import MealModalTrigger from "./MealCardClient";

export default function MealCard({ meal, mealIndex, settingsCookie }) {

  //  star rating meal (non-interactive)
  const StaticStars = () => {
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

  // Render the meal card and popup
  return (
      <div
        key={mealIndex}
        data-layout={settingsCookie?.layout}
        className={styles.mealCard}
        data-item-id={meal?.artikel_id}
      >
          <Image
            priority
            fetchPriority="high"
            src={meal?.image ? meal?.imageUrl : "/plate_placeholder.png"}
            alt="dish-image" title={meal.mergedTitle[0]} 
            className={styles.mealImage}
            width={640} height={310} />

        <p className={styles.mealLocation}>
          {meal?.dpartname}

          {meal?.dpname == "Robotic Kitchen" ? <Bot size={20} className={styles.otherIcon} /> : ""}
          {meal?.dpartname == "Salatbüfett" ? <SaladIcon size={20} className={styles.otherIcon} /> : ""}
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
            <StaticStars />
          </div>
        </div>
        <MealModalTrigger meal={meal}/>
      </div>
  );
}
