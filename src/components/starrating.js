"use client";
import styles from "./details.module.css";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from 'react-hot-toast';

export default function StarRating({ meal }) {
    const [hover, setHover] = useState(null);
    const [rating, setRating] = useState(meal.rating);
    console.log(meal.m_id)

    async function sendrating(rating) {

        toast.loading('Please wait...'); 
        fetch(`https://www.mensa-kl.de/ajax/rate.php?m_id=999999&rating=${rating}`, {
            method: 'GET',
            headers: {
                'Priority': 'u=0',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'Referer': 'https://kl-mensa.vercel.app/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36',
                'Origin': 'https://kl-mensa.vercel.app',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        })
        setTimeout(() => {
            toast.dismiss();
            toast.error('Studentenwerk macht mal cors allow in headers von api rein pls :(');
        }, 1000);
    }

  return (
    <div className={styles.starRating} onMouseEnter={() => setHover(1)} onMouseLeave={() => setHover(0)}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${styles.star} ${
          i < rating ? styles.starFilled : styles.starEmpty
        }`}
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