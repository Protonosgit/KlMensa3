"use client";
import {retrieveMenuCached, ParseMenu} from '@/app/utils/meal-parser';
import styles from "../app/page.module.css";
import Meal from './MealCard';
import { applyFilterList } from '@/app/utils/filter.js';
import dynamic from "next/dynamic";
import MealModalTrigger from './CardModalTrigger';
import { getCookie } from "@/app/utils/client-utils";
import { useEffect, useState } from 'react';

const DynamicMealPopup = dynamic(() => import("./DetailsModal"), { ssr: true });



export default function ScheduleGrid({}) {
  const [locationFilter, setLocationFilter] = useState([]);
  const [proteinFilter, setProteinFilter] = useState([]);
  const [additiveFilter, setAdditiveFilter] = useState([]);
  const [settings, setSettings] = useState(null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    async function loadAllData() {
      const settings = getCookie('settings');
      const proteinCookie = getCookie("protein");
      const additiveCookie = getCookie("additive");
      const locationCookie = getCookie("location");
    
      const menuData = await retrieveMenuCached();
      const maxMealCount = settings?.nolimit ? undefined : 7;
      const menu = menuData?.slice(0, maxMealCount);
      setMenu(menu);
      setLocationFilter(locationCookie);
      setProteinFilter(proteinCookie);
      setAdditiveFilter(additiveCookie);
      setSettings(settings);
    
    }
    loadAllData();
  
  }, []);



  // Check if menu data is available
  if (!menu || !menu?.length) {
    return (
      <div className={styles.emptyList}>
        <h3>API fault</h3>
        <p>The studierendenwerk API is currently unavailable. <br/>Please try again later <br/> ＞﹏＜</p>
      </div>
    );
  }

const weekdayFormatter = new Intl.DateTimeFormat("de-DE", {
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