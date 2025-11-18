import { cookies } from 'next/headers';
import { fetchMenu } from '@/app/utils/schedule-parser';
import styles from "../app/page.module.css";
import { format } from 'date-fns';
import Meal from './MealCard';
import { applyFilters } from '@/app/utils/filter.js';
import dynamic from "next/dynamic";

const DynamicMealPopup = dynamic(() => import("./DetailsModal"), { ssr: true });


export default async function ScheduleGrid({settingsCookie}) {
  const cookieStore = await cookies();

  let locationFilter, proteinFilter, additiveFilter;

  //Read cookies
  const locationFilterCookie = cookieStore.get("location") || null;
  const proteinFilterCookie = cookieStore.get("protein") || null;
  const additiveFilterCookie = cookieStore.get("additive") || null;

  //Parse cookies
  if (locationFilterCookie?.value) {
    locationFilter = JSON.parse(locationFilterCookie.value);
  }
  if (proteinFilterCookie?.value) {
    proteinFilter = JSON.parse(proteinFilterCookie.value);
  }
  if (additiveFilterCookie?.value) {
    additiveFilter = JSON.parse(additiveFilterCookie.value);
  }

  let menuData = await fetchMenu();
  const maxMealCount = settingsCookie?.nolimit ? undefined : 8;
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
              {applyFilters(
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
                    settingsCookie={settingsCookie}
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