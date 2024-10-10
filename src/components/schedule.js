import Image from 'next/image'
import { startOfWeek } from 'date-fns'
import { fetchFullSchedule, fetchMenu } from '@/app/utils/api-bridge';
import styles from "../app/page.module.css";
import Meal from './meal';
export default async function Schedule() {

  const menu = await fetchMenu()

  return (
    <>
        {menu.map((day, dayIndex) => {
          return (
            <div key={dayIndex} className={styles.dayContainer}>
              <h3 className={styles.dayTitle}>{day.date}</h3>
              <div className={styles.mealGrid}>
                {day.meals.map((meal, mealIndex) => {
                  return (
                    <Meal
                      key={mealIndex}
                      meal={meal}
                      mealIndex={mealIndex}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
        </>
  )
}