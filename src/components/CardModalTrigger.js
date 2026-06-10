"use client";
import { useEffect } from "react";
import { useModalStore } from "@/app/utils/contextStore";
import toast from "react-hot-toast";


export default function MealModalTrigger({meals}) {
  const { openModal, isOpen } = useModalStore();

  // prevent background scrolling while modal is visible
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function enableModalMode(targetId, targetLocation) {
    if(!navigator.onLine) {toast('Offline', { icon: '⛔',}); return false;}
    if (isOpen) return false;
    const meal = meals?.flatMap(day => day.meals).find(meal => meal.murmurID === targetId && (meal.dpartname === targetLocation || !targetLocation));
    if(!meal) return false;
    openModal(meal);
    return true;
  }

  useEffect(() => {
    // load modal by urlid
    const urlParams = new URLSearchParams(window.location.search);
    if(!enableModalMode(urlParams.get("artid"))) {
      window.history.replaceState(null, '', "/");
    }

    // load modal by onclick
    const cards = document.querySelectorAll("#mealcard")
    cards.forEach((card) => {
      card.addEventListener("click", (event) => {
        const el = event.currentTarget
        const id = el.dataset.id
        const locationElement = el.querySelector("#mealLocation")
        const location = locationElement.dataset.id

        if(enableModalMode(id, location)) {
          window.history.pushState(null, '', window.location.href + "?artid=" + id);
        }
        
      })
    })

    return () => {
      window.removeEventListener("click", enableModalMode);
    };
  }, [])

  return null
}
