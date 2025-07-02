import { extractAdditiveCodes } from "./additives";


function applyClientFilters(locCookie, protCookie, adiCookie, meals) {
  if(!locCookie || !protCookie || !adiCookie) return meals;

  const locationArray = JSON.parse(locCookie);
  const proteinArray = JSON.parse(protCookie);
  const additiveArray = JSON.parse(adiCookie);


  const filteredMeals = meals.filter(meal => {
    if (locationArray.includes(meal.loc)) {
      return false;
    }
    if (proteinArray.includes(meal.protein)) {
      return false;
    }
    if (proteinArray.some(protein => extractAdditiveCodes(meal.title_with_additives).includes(protein))) {
      return false;
    }
    if (additiveArray.some(additive => extractAdditiveCodes(meal.title_with_additives).includes(additive))) {
      return false;
    }
    return true;
  });

  return filteredMeals;
}



export { applyClientFilters };
