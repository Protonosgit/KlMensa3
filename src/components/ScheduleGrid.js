import { cookies } from 'next/headers';
import {retrieveMenuCached, ParseMenu} from '@/app/utils/meal-parser';
import styles from "../app/page.module.css";
import Meal from './MealCard';
import { applyFilterList } from '@/app/utils/filter.js';
import dynamic from "next/dynamic";
import MealModalTrigger from './CardModalTrigger';

const DynamicMealPopup = dynamic(() => import("./DetailsModal"), { ssr: true });

// Move formatters outside to avoid recreation
const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
});

const DAY_MONTH_FORMATTER = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
});

const safeJSONParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

export default async function ScheduleGrid() {
  const cookieStore = await cookies();
  const locationFilter = safeJSONParse(cookieStore.get('location')?.value);
  const proteinFilter = safeJSONParse(cookieStore.get('protein')?.value);
  const additiveFilter = safeJSONParse(cookieStore.get('additive')?.value);
  const settings = safeJSONParse(cookieStore.get('settings')?.value);

  let menuData = await retrieveMenuCached();

  const maxMealCount = settings?.nolimit ? undefined : 7;
  const menu = menuData?.slice(0, maxMealCount);

  if (!menu || !menu?.length) {
    return (
      <div className={styles.emptyList}>
        <h3>API fault</h3>
        <p>The Studierendenwerk API is currently unavailable. <br/>Please try again later <br/> ＞﹏＜</p>
      </div>
    );
  }

  // Pre-calculate filter
  const menuWithFilteredMeals = menu.map(day => ({
    ...day,
    filteredMeals: applyFilterList(
      locationFilter,
      proteinFilter,
      additiveFilter,
      day?.meals
    )
  }));



  return (
    <>
      {menuWithFilteredMeals.map((day, dayIndex) => {
        return (
          <div key={dayIndex} className={styles.dayContainer}>
            <div className={styles.dayHeader}>
              <h3 className={styles.dayTitle}>{WEEKDAY_FORMATTER.format(new Date(day.date))}</h3>
              <h3 className={styles.dayTitle}>{DAY_MONTH_FORMATTER.format(new Date(day.date))}</h3>
            </div>
            <div className={styles.mealList}>
              {day.filteredMeals.map((meal, mealIndex) => (
                <Meal
                  key={mealIndex}
                  meal={meal}
                  mealIndex={mealIndex}
                  dayIndex={dayIndex}
                  settings={settings}
                />
              ))}
            </div>
          </div>
        );
      })}
      <DynamicMealPopup />
      <MealModalTrigger meals={menuWithFilteredMeals}/>
    </>
  );
}