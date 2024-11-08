import {  fetchMenu } from '@/app/utils/api-bridge';
import styles from "../app/page.module.css";
import Meal from './meal';
import { format } from 'date-fns';
import AdInjector from '@/components/ad-injector';

export default async function Schedule() {

  // This triggers the api bridge to fetch the uncached current data
  const menu = await fetchMenu();

  if (!menu || !menu?.length) {
    return (
      <div className={styles.emptyList}>
        <p>No schedule data found!</p>
      </div>
    );
  }

  const AdInjectorProxy = ({day}) => {
    // TODO: Fetch info from supabase
    const campainTargetDays = ["2024-11-99","2024-11-99"]
    return campainTargetDays.includes(format(day.date, 'yyyy-MM-dd')) ? <AdInjector /> : null;
  };

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
                <AdInjectorProxy day={day} />
              </div>
            </div>
          )
        })}
        </>
  )
}