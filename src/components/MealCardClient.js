"use client";
import { useEffect } from "react";
import { useModalStore } from "@/app/utils/contextStore";


export default function MealModalTrigger({meals}) {
  const { openModal, isOpen } = useModalStore();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const cards = document.querySelectorAll("#mealcard")

    cards.forEach((card) => {
      card.addEventListener("click", (event) => {
        const el = event.currentTarget
        const id = el.dataset.id
        console.log(id)

        if (isOpen) return;
        window.history.pushState(null, '', window.location.href + "?artid=" + id);
        const meal = meals?.flatMap(day => day.meals).find(meal => meal.murmurID === id);
        openModal(meal);
      })
    })
  }, [])

  return null
}