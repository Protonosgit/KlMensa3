import {  fetchMenu } from '@/app/utils/api-bridge';
import styles from "../app/page.module.css";
import Meal from './meal';
import { format } from 'date-fns';
import AdInjector from '@/components/ad-injector';

export default async function Schedule() {

  const menu = await fetchMenu();

  if(!menu) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <>
        {menu.map((day, dayIndex) => {
          return (
            <div key={dayIndex} className={styles.dayContainer}>
              <h3 className={styles.dayTitle}>{format(day.date, 'eeee dd.MM')}</h3>
              <hr className={styles.daySeperator} />
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
                {/* {dayIndex === 0 && 
                  <AdInjector link={'https://kl-mensa.vercel.app'} title={'Developed by Protonos'} image={day.ad_image} />
                } */}
              </div>
            </div>
          )
        })}
        </>
  )
}