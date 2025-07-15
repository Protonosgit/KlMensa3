import { cookies } from 'next/headers';
import {  fetchMenu, fetchMealComments } from '@/app/utils/api-bridge';
import styles from "../app/page.module.css";
import { format } from 'date-fns';
import { fetchComments,fetchImages } from '@/app/utils/database-actions';
import DataBridge from './mealschedule-bridge';

export default async function Schedule() {
  const cookieStore = await cookies();
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
                <DataBridge mealDay={day} index={dayIndex} comments={comments} images={images} />
              </div>
            </div>
          )
        })}
        </>
  )
}