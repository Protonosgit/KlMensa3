import { cookies } from 'next/headers';
import {retrieveMenuCached} from '@/app/utils/meal-parser';
import styles from "../app/page.module.css";
import format from 'date-fns/format'
import Meal from './MealCard';
import { applyFilterList } from '@/app/utils/filter.js';
import dynamic from "next/dynamic";

const DynamicMealPopup = dynamic(() => import("./DetailsModal"), { ssr: true });


export default async function ScheduleGrid({}) {

  const safeJSONParse = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  };

  const combinedCookies = await Promise.all([
    cookies().then((c) => c.get('location')),
    cookies().then((c) => c.get('protein')),
    cookies().then((c) => c.get('additive')),
    cookies().then((c) => c.get('settings')),
  ]);

  const [
    locationFilterCookie,
    proteinFilterCookie,
    additiveFilterCookie,
    settingsCookie,
  ] = combinedCookies.map((cookie) => cookie?.value ? safeJSONParse(cookie.value) : null);

  const locationFilter = locationFilterCookie || null;
  const proteinFilter = proteinFilterCookie || null;
  const additiveFilter = additiveFilterCookie || null;
  const settings = settingsCookie || null;

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
      <DynamicMealPopup />
    </>
  );
}