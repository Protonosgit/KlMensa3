"use client";
import Image from "next/image";
import { Star, BadgeInfo, Megaphone } from "lucide-react";
import styles from "../app/page.module.css";
import Link from "next/link";


// This will replace scheduled "News"
// Internal distribution system will be on supabase
// Might add cookie to disable this seperately from filters

export default function AdInjector({link, title, image  }) {

  return (
    <div className={styles.mealCard}>
      <Link
      href={link ? link : '#'}
      >
        <Image src={image? image : "/image_placeholder.jpg"} alt="placeholder-image" className={styles.mealImage} width={600} height={400} />
        <div className={styles.mealInfo}>
          <p className={styles.mealLocation}><BadgeInfo size={20} style={{verticalAlign: 'middle', marginRight: '5px'}} />Advertisement
          </p>
          <h4 className={styles.mealTitle}>{title}</h4>
        </div>
      </Link>
      <Link href={'/whyads'} className={styles.adReason}>Why are you reading this?</Link>
    </div>
  );
}
