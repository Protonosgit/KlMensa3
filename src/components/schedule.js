import Image from 'next/image'
import { startOfWeek } from 'date-fns'
import { fetchFullSchedule } from '@/app/utils/api-bridge';
import styles from "../app/page.module.css";
import Meal from './meal';
export default async function Schedule() {
  const startDate = startOfWeek(new Date())

  const mealSchedule = await fetchFullSchedule()

  return (
    <>
        {mealSchedule.map((day, index) => {
          return (
            <div key={index} className={styles.dayContainer}>
              <h3 className={styles.dayTitle}>{day?.$.date}</h3>
              <div className={styles.mealGrid}>
              {day.meal?.filter(meal => meal.title_html).map((meal, mealIndex) => (
                <Meal key={mealIndex} meal={meal} mealIndex={mealIndex} />
                ))}
              </div>
            </div>
          )
        })}
        </>
  )
}