"use client";
import Image from "next/image";
import { Star, Bot } from "lucide-react";
import styles from "./mealcard.module.css";
import { useEffect, useState } from "react";
import { getCookie } from "@/app/utils/cookie-monster";
import  VeganIcon from "../../public/icons/VeganIcon.svg";
import VeggieOpIcon from "../../public/icons/VeggieOpIcon.svg";
import VeganOpIcon  from "../../public/icons/VeganOpIcon.svg";
import { useModalStore } from "@/app/utils/contextStore";


export default function Meal({ meal, mealIndex, settingsCookie }) {

  // State variables
  const { openModal, isOpen } = useModalStore();


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

  // Render the meal card and popup.
  return (
      <div
        key={mealIndex}
        data-layout={settingsCookie?.layout}
        className={styles.mealCard}
        onClick={() => requestOpenModal()} 
      >
        {/* Meal image */}
          <Image
            priority
            src={meal?.image ? meal?.imageUrl : "/plate_placeholder.png"}
            alt="dish-image" title={meal.atextohnezsz1} 
            className={styles.mealImage}
            width={1600} height={900} />

        <p className={styles.mealLocation}>
          {meal?.dpartname}

          {meal?.dpname == "Robotic Kitchen" ? <Bot size={20} className={styles.otherIcon} /> : ""}
          {meal?.vegiOption ? <VeggieOpIcon className={styles.greenIcon} /> : ""}
          {meal?.veganOption ? <VeganOpIcon className={styles.greenIcon} /> : ""}
          {meal?.menuekennztext == "V+" ? <VeganIcon className={styles.greenIcon}/> : ""}
        </p>

        {/* Meal details */}
        <div className={styles.mealInfo}>
          <div className={styles.mealContextLabels}></div>
          <h4 className={styles.mealTitle}>{(settingsCookie?.shortitle ? meal?.atextohnezsz1 : meal?.titleCombined)}</h4>
          <div className={styles.mealFooter}>
            <span className={styles.mealPrice}>{meal.price && (meal?.price[settingsCookie?.pricecat] || meal?.price?.stu) || meal?.price?.price}</span>
            {renderStarRating()}
          </div>
        </div>
      </div>
    
  );
}
