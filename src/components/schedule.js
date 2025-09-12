import { cookies } from 'next/headers';
import {  fetchMenu } from '@/app/utils/schedule-parser';
import styles from "../app/page.module.css";
import { format } from 'date-fns';
import Meal from './meal';
import { applyFilters } from '@/app/utils/filter.js';
import MealPopup from './detailsModal';


export default async function Schedule({settingsCookie}) {
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

  let menu;
  const menudata = await fetchMenu();

  // Cut down on shown meals
  if (!settingsCookie?.nolimit) {
    menu = menudata?.slice(0, 8);
  }


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
      <MealPopup mealsFull={menu} />
    </>
  );
}