"use client";
import { useEffect } from "react";
import { useModalStore } from "@/app/utils/contextStore";

export default function MealModalTrigger({ meal, fullIndex }) {
  const { openModal, isOpen } = useModalStore();

  useEffect(() => {
    // Disable page scrolling when the meal popup is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);
  

  // Open the meal popup and set url param for back gesture detection
  const requestOpenModal = () => {
    if(isOpen) return;
    window.history.pushState(null, '', window.location.href+"?artid="+meal.artikel_id);
    openModal(meal);
  };


  useEffect(() => {
    const parent = document.querySelector(`[data-item-id="${fullIndex}"]`);
    if (!parent) return;

    const handleClick = () => {
      requestOpenModal();
    };

    parent.addEventListener('click', handleClick);
    return () => parent.removeEventListener('click', handleClick);

  }, [meal.artikel_id]);


  return null;
}
