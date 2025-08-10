import { cookies } from 'next/headers';
import {  fetchMenu } from '@/app/utils/api-bridge';
import styles from "../app/page.module.css";
import { format } from 'date-fns';
import { fetchComments,fetchImages } from '@/app/utils/database-actions';
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

  // Get menu, images and comments from supabase and legacy api
  // Slow more caching required!
  // 200-600ms
  const menuData = await fetchMenu();
  let menu = menuData?.splitMenu;
  const hashIds = menuData?.hashIdList;
  const comments = await fetchComments(hashIds);
  const images = await fetchImages(hashIds);


  // Show unlimeted menu dates
  if (!settingsCookie?.nolimit) {
    menu = menu?.slice(0, 8);
  }


  // Check if menu data is available
  if (!menu || !menu?.length) {
    return (
      <div className={styles.emptyList}>
        <p>Server did not return a valid menu!</p>
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
              className={`${styles.mealGrid} ${
                settingsCookie?.layout === "grid" && styles.mealGridMobileNew}`}
            >
              {applyFilters(
                locationFilter,
                proteinFilter,
                additiveFilter,
                day?.meals
              ).map((meal, mealIndex) => {
                // Filter comments to match the current meal
                const filteredComments = () => {
                  if (comments && comments.length > 0) {
                    return comments.filter(
                      (comment) => comment?.article_id === meal?.artikel_id
                    );
                  }
                  return [];
                };
                // Filter images to match the current meal
                const filteredImages = () => {
                  if (images && images.length > 0) {
                    return images.filter(
                      (image) => image?.article_id === meal?.artikel_id
                    );
                  }
                  return [];
                };

                return (
                  <Meal
                    key={mealIndex}
                    meal={meal}
                    mealIndex={mealIndex}
                    comments={filteredComments()}
                    images={filteredImages()}
                    settingsCookie={settingsCookie}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      <MealPopup mealsFull={menuData?.splitMenu} commentsFull={comments} imagesFull={images} />
    </>
  );
}