import { cookies } from 'next/headers';
import {  fetchMenu, fetchMealComments } from '@/app/utils/api-bridge';
import styles from "../app/page.module.css";
import Meal from './meal';
import { format } from 'date-fns';
import { applyClientFilters } from '@/app/utils/filter.js';
import { fetchComments,fetchImages } from '@/app/utils/database-actions';

export default async function Schedule() {
  const cookieStore = await cookies();
  const locCookie = cookieStore.get('location') || [];
  const protCookie = cookieStore.get('protein') || [];
  const adiCookie = cookieStore.get('additive') || [];
  const settingsCookie = cookieStore.get('settings') || null;

  let settings;
  const menuData = await fetchMenu();
  let menu = menuData?.splitMenu;
  const hashIds = menuData?.hashIdList;
  const comments = await fetchComments(hashIds);
  const images = await fetchImages(hashIds);

  if(settingsCookie?.value) {
    settings = JSON.parse(settingsCookie.value);
  }

  if(!settings?.nolimit) {
    menu = menu?.slice(0, 8);
  }

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
                  const filteredComments = () => {
                    if(comments && comments.length > 0) {
                      return comments.filter(comment => comment?.article_id === meal?.artikel_id);
                    }
                    return []
                  }
                  const filteredImages = () => {
                    if(images && images.length > 0) {
                      return images.filter(image => image?.article_id === meal?.artikel_id);
                    }
                    return []
                  }
                  return (
                    <Meal
                      key={mealIndex}
                      meal={meal}
                      mealIndex={mealIndex}
                      mealComments={filteredComments()}
                      mealImages={filteredImages()}
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