import { extractAdditiveCodes } from "./additives";


function applyClientFilters(locCookie, protCookie, adiCookie, meals) {
  if(!locCookie || !protCookie || !adiCookie) return meals;

  const locationArray = JSON.parse(locCookie);
  const proteinArray = JSON.parse(protCookie);
  const additiveArray = JSON.parse(adiCookie);


  const filteredMeals = meals.filter(meal => {
    if (locationArray.includes(meal.dispoart_id)) {
      return false;
    }
    if (proteinArray.some(protein => extractAdditiveCodes(meal.zsnummern).includes(protein))) {
      return false;
    }
    if (additiveArray.some(additive => extractAdditiveCodes(meal.zsnummern).includes(additive))) {
      return false;
    }
    return true;
  });

  return filteredMeals;
}



export { applyClientFilters };
