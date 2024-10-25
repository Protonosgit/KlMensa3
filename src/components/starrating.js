"use client";
import styles from "./details.module.css";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from 'react-hot-toast';

export default function StarRating({ meal }) {
    const [hover, setHover] = useState(null);
    const [rating, setRating] = useState(meal.rating);

    async function sendrating(rating) {
        toast.loading('Please wait...'); 
        // const response = await fetch(`/api/relay?rating=${999999}&m_id=${meal.m_id}`, {
        const response = await fetch(`/api/relay?rating=${rating}&m_id=${meal.m_id}`, {
            method: 'GET',
            headers: {
            }
        })
        setTimeout(() => {
            toast.dismiss();
            // This should be verified but not now!
            toast.success('Thank you for your rating!');
        }, 1000);
    }

  return (
    <div className={styles.starRating} onMouseEnter={() => setHover(1)} onMouseLeave={() => setHover(0)} title="Press star to submit rating">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${styles.star} ${ i < rating ? styles.starFilled : (i < hover ? styles.starHover : styles.starEmpty) } ${i < hover ? styles.starHover : ""}`}
        onMouseEnter={() => setHover(i + 1)}
        onMouseLeave={() => setHover(0)}
        onClick={() => sendrating(i + 1)}
      />
    ))}
    <span className={styles.ratingCount}>{meal.rating_amt}</span>
    <Toaster />
  </div>
  )
}