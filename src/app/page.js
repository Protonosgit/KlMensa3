import Image from 'next/image'
import { startOfWeek } from 'date-fns'
import { Star, LocateIcon } from 'lucide-react'
import { fetchFullSchedule } from '../../utils/api-bridge'
import styles from "./page.module.css";

export default async function Component() {
  const startDate = startOfWeek(new Date())

  const mealSchedule = await fetchFullSchedule()

  const renderStarRating = (rating) => {
    return (
      <div className={styles.starRating}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${styles.star} ${
              i < Math.floor(rating._) ? styles.starFilled : styles.starEmpty
            }`}
          />
        ))}
        <span className={styles.ratingCount}>{rating.$.amt}</span>
      </div>
    )
  }

  const renderImage = (meal) => {
    if(meal.mimg) {
      return <Image src={'https://www.mensa-kl.de/mimg/'+meal.mimg[0]?._} alt={'user_provided_image'} className={styles.mealImage} width={600} height={400} />
    } else{
      return <Image src={'/plate_placeholder.png'} alt={'image_not_found'} className={styles.mealImage} width={600} height={400} />
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.headerTitle}>KL Mensa</h1>
        </div>
      </header>

      <main className={styles.main}>
        <h2 className={styles.weekTitle}>
          {mealSchedule[0]?.$?.date} - {mealSchedule[mealSchedule.length - 1]?.$?.date}
        </h2>

        {mealSchedule.map((day, index) => {
          return (
            <div key={index} className={styles.dayContainer}>
              <h3 className={styles.dayTitle}>{day?.$.date}</h3>
              <div className={styles.mealGrid}>
              {day.meal?.filter(meal => meal.title_html).map((meal, mealIndex) => (
                  <div key={mealIndex} className={styles.mealCard}>
                    {renderImage(meal)}
                    <div className={styles.mealInfo}>
                      <p className={styles.mealLocation}>{meal.loc[0]?.$?.name}</p>
                      <h4 className={styles.mealTitle}>{meal.title_html}</h4>
                      <div className={styles.mealFooter}>
                        <span className={styles.mealPrice}>${meal.$.price}</span>
                        {renderStarRating(meal.rating[0])}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </main>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2024 Mensa KL operated by <a href="https://www.studierendenwerk-kaiserslautern.de/" className={styles.footerLink}>Studierendenwerks Kaiserslautern.</a></p>
          <a href="https://www.mensa-kl.de/legal.html" className={styles.footerLink}>Privacy Policy</a>
        </div>
      </footer>
    </div>
  )
}