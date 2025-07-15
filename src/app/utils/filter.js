import { extractAdditiveCodes } from "./additives";


function applyClientFilters(locCookie, protCookie, adiCookie, meals) {
  if(!locCookie || !protCookie || !adiCookie) return meals;

  const filteredMeals = meals.filter(meal => {
    if (locCookie.includes(meal.dispoart_id)) {
      return false;
    }
    if (protCookie.some(protein => extractAdditiveCodes(meal.zsnummern).includes(protein))) {
      return false;
    }
    if (adiCookie.some(additive => extractAdditiveCodes(meal.zsnummern).includes(additive))) {
      return false;
    }
    return true;
  });

  return filteredMeals;
}



export { applyClientFilters };
