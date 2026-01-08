import { cookies } from 'next/headers';
import ParseMenu from '@/app/utils/meal-parser';
import styles from "../app/page.module.css";
import { format } from 'date-fns';
import Meal from './MealCard';
import { applyFilterList } from '@/app/utils/filter.js';
import dynamic from "next/dynamic";

const DynamicMealPopup = dynamic(() => import("./DetailsModal"), { ssr: true });


export default async function ScheduleGrid({}) {
  const cookieStore = await cookies();

  const safeJSONParse = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  };

  const locationFilterCookie = cookieStore.get('location')
  const locationFilter = locationFilterCookie?.value ? safeJSONParse(locationFilterCookie.value) : null
  const proteinFilterCookie = cookieStore.get('protein')
  const proteinFilter = proteinFilterCookie?.value ? safeJSONParse(proteinFilterCookie.value) : null
  const additiveFilterCookie = cookieStore.get('additive')
  const additiveFilter = additiveFilterCookie?.value ? safeJSONParse(additiveFilterCookie.value) : null
  const settingsCookie = cookieStore.get('settings')
  const settings = settingsCookie?.value ? safeJSONParse(settingsCookie.value) : null


  let menuData = await ParseMenu();
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

  return (
    <>
      {menu.map((day, dayIndex) => {
        return (
          <div key={dayIndex} className={styles.dayContainer}>
            <div className={styles.dayHeader}>
              <h3 className={styles.dayTitle}>{format(day.date, "eeee")}</h3>
              <h3 className={styles.dayTitle}>{format(day.date, "dd.MM")}</h3>
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
      <DynamicMealPopup mealsFull={menu} />
    </>
  );
}