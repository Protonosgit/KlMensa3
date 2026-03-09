"use client";
import { useEffect } from "react";
import { useModalStore } from "@/app/utils/contextStore";


export default function MealModalTrigger({ meal, children }) {
  const { openModal, isOpen } = useModalStore();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClick = () => {
    console.log("meal");
    if (isOpen) return;
    window.history.pushState(null, '', window.location.href + "?artid=" + meal.murmurID);
    openModal(meal);
  };

  return (
    <div onClick={handleClick} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
