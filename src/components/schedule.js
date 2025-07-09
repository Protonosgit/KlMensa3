import { cookies } from 'next/headers';
import {  fetchMenuLegacy,fetchMealUserData, fetchMenu } from '@/app/utils/api-bridge';
import styles from "../app/page.module.css";
import Meal from './meal';
import { format } from 'date-fns';
import { applyClientFilters } from '@/app/utils/filter.js';

export default async function Schedule() {
  const cookieStore = cookies();
  const locCookie = cookieStore.get('location') || [];
  const protCookie = cookieStore.get('protein') || [];
  const adiCookie = cookieStore.get('additive') || [];
  const settingsCookie = cookieStore.get('settings') || null;

  let settings;
  const menu = await fetchMenu();

  if(settingsCookie?.value) {
    settings = JSON.parse(settingsCookie.value);
  }

  await fetchMenu();

  if (!menu || !menu?.length) {
    return (
      <div className={styles.emptyList}>
        <p>No schedule data found!</p>
      </div>
    );
  }


  return (
    <>
        {menu.map((day, dayIndex) => {
          return (
            <div key={dayIndex} className={styles.dayContainer}>
              <div className={styles.dayHeader}>
                <h3 className={styles.dayTitle}>{format(day.date, 'eeee')}</h3>
                <h3 className={styles.dayTitle}>{format(day.date, 'dd.MM')}</h3>
              </div>
              <div className={`${styles.mealGrid} ${settings?.by2lay ? styles.mealGridMobileNew : ''}`} >
                {applyClientFilters(locCookie.value, protCookie.value, adiCookie.value, day.meals).map((meal, mealIndex) => {
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