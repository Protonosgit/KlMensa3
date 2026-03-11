import { cookies } from 'next/headers';
import {retrieveMenuCached, ParseMenu} from '@/app/utils/meal-parser';
import styles from "../app/page.module.css";
import Meal from './MealCard';
import { applyFilterList } from '@/app/utils/filter.js';
import dynamic from "next/dynamic";
import MealModalTrigger from './CardModalTrigger';

const DynamicMealPopup = dynamic(() => import("./DetailsModal"), { ssr: true });


export default async function ScheduleGrid({}) {

  const safeJSONParse = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  };

  const cookieStore = await cookies();
  const locationFilter = safeJSONParse(cookieStore.get('location')?.value);
  const proteinFilter = safeJSONParse(cookieStore.get('protein')?.value);
  const additiveFilter = safeJSONParse(cookieStore.get('additive')?.value);
  const settings = safeJSONParse(cookieStore.get('settings')?.value);

  let menuData = await retrieveMenuCached();
  const maxMealCount = settings?.nolimit ? undefined : 8;
  const menu = menuData?.slice(0, maxMealCount);


  // Check if menu data is available
  if (!menu || !menu?.length) {
    return (
      <div className={styles.emptyList}>
        <p>Api did not return a valid menu on time!</p>
      </div>
    );
  }

const weekdayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
});

const dayMonthFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
});

  return (
    <>
      {menu.map((day, dayIndex) => {
        return (
          <div key={dayIndex} className={styles.dayContainer}>
            <div className={styles.dayHeader}>
              <h3 className={styles.dayTitle}>{weekdayFormatter.format(new Date(day.date))}</h3>
              <h3 className={styles.dayTitle}>{dayMonthFormatter.format(new Date(day.date))}</h3>
            </div>
            <div
              className={styles.mealList}>
              {applyFilterList(
                locationFilter,
                proteinFilter,
                additiveFilter,
                day?.meals
              ).map((meal, mealIndex) => {

                return (
                  <Meal
                    key={mealIndex}
                    meal={meal}
                    mealIndex={mealIndex}
                    dayIndex={dayIndex}
                    settings={settings}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      <DynamicMealPopup />
      <MealModalTrigger meals={menu}/>
    </>
  );
}