"use client";
import Image from "next/image";
import { Star, Bot, SoupIcon, SaladIcon } from "lucide-react";
import styles from "./mealcard.module.css";
import { useEffect } from "react";
import  VeganIcon from "../../public/icons/VeganIcon.svg";
import VeggieOpIcon from "../../public/icons/VeggieOpIcon.svg";
import VeganOpIcon  from "../../public/icons/VeganOpIcon.svg";
import { useModalStore } from "@/app/utils/contextStore";

export default function Meal({ meal, mealIndex, settingsCookie }) {

  const { openModal, isOpen } = useModalStore();


  useEffect(() => {
    // Disable page scrolling when the meal popup is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);
  

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

  // Open the meal popup and set url param for back gesture detection
  const requestOpenModal = () => {
    if(isOpen) return;
    window.history.pushState(null, '', window.location.href+"?artid="+meal.artikel_id);
    openModal(meal);
  };

  // Render the meal card and popup
  return (
      <div
        key={mealIndex}
        data-layout={settingsCookie?.layout}
        className={styles.mealCard}
        onClick={() => requestOpenModal()} 
      >
          <Image
            priority
            fetchPriority="high"
            src={meal?.image ? meal?.imageUrl : "/plate_placeholder.png"}
            onError={(e) => {
              const img = e.currentTarget;
              if (img.dataset.fallbackApplied) return;
              img.onerror = null;
              img.removeAttribute("srcset");
              img.dataset.fallbackApplied = "1";
              img.src = "/plate_placeholder.png";
            }}
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
      </div>
    
  );
}
