"use client";

import { extractAdditives } from "./additives";

function locFilter(meal, cookies) {
    if (!meal || !cookies || cookies.length < 10) {
      return true;
    }
  
    const locationIndex = {
      "1": 0,
      "2": 0,
      "1veg": 1,
      "1vegan": 1,
      "2vegan": 1,
      "2veg": 1,
      "Wok": 2,
      "Grill": 3,
      "Buffet": 4,
      "AtriumMenü": 5,
      "AtriumMenüVegan": 6,
      "SalatbufettV+": 7,
      "Abend": 8,
      "AbendVegan": 9,
      "News": 10
    };
  
    const locKey = meal.loc;
    const index = locationIndex[locKey];
  
    return index !== undefined && cookies[index].shown;
  }

function protFilter(meal, cookies) {
    if (!meal || !cookies || cookies.length < 6) {
      return true;
    }

  
    const iconIndex = {
      "pork": 0,
      "beef": 1,
      "chicken": 2,
      "fish": 3,
      "boar": 4,
      "sheep": 5,
      "duck": 6,
      "berk": [0, 1],
      "": 7
    };
  
    const iconKey = meal.icon;
    const indices = Array.isArray(iconIndex[iconKey]) ? iconIndex[iconKey] : [iconIndex[iconKey]];

    if(!indices[0]) {
      return true
    }
  
    return indices.every(i => cookies[i].shown);
  }

function addFilter(meal, cookies) {
    if(meal === null || cookies === null) return true
    if(cookies.length < 6) return true

    // TODO: Add specific function which returns only shortcodes of additives
    const containedAdditives = extractAdditives(meal.title_with_additives)

    return containedAdditives.every(additive => {
        const cookie = cookies.find(c => c.name === additive);
        return cookie ? cookie.shown : true;
    });

}

export { locFilter, protFilter, addFilter };
