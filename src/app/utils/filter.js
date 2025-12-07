import { extractAdditiveCodes } from "./additives";


function applyFilterList(locCookie, protCookie, adiCookie, meals) {
  if(!locCookie || !protCookie || !adiCookie) return meals;


  const rebuildMeals = [];
  for (let index = 0; index < meals.length; index++) {
    let meal = meals[index];

    // Filter for locations
    if (locCookie.includes(meal.dispoart_id)) {
      continue;
    }
    
    // Set up lists for filtering
    const regAdditives = meal?.titleRegAdditives?.flat() || [];
    const altAdditives = meal?.titleAltAdditives?.flat() || [];
    const generalAdditives = extractAdditiveCodes(meal.zsnummern);

    // Set up traps
    const r_test_1 = protCookie.some(protein => regAdditives.includes(protein))
    const a_test_1 = protCookie.some(protein => altAdditives.includes(protein))
    const g_test_1 = protCookie.some(protein => generalAdditives.includes(protein))

    const r_test_2 = adiCookie.some(additive => regAdditives.includes(additive))
    const a_test_2 = adiCookie.some(additive => altAdditives.includes(additive))
    const g_test_2 = adiCookie.some(additive => generalAdditives.includes(additive))

    // Trap1 general additive filtering
    if((g_test_1 && !a_test_1 && !r_test_1) || (r_test_1 && a_test_1 && g_test_1)) {
      continue;
    }
    if((g_test_2 && !a_test_2 && !r_test_2) || (r_test_2 && a_test_2 && g_test_2)) {
      continue;
    }

    // Trap2 variant specific additive filtering
    if(r_test_1 || a_test_1 || r_test_2 || a_test_2) {
      if(r_test_1 || r_test_2) {
        meal.titleReg = meal.titleAlt
        meal.titleRegAdditives = meal.titleAltAdditives
      }
        meal.titleAlt = [];
        meal.titleAltAdditives = [];
        meal.altType = 0;
    }

    rebuildMeals.push(meal);
  }

  return rebuildMeals;
}


function applyFilterListOld(locCookie, protCookie, adiCookie, meals) {
  if(!locCookie || !protCookie || !adiCookie) return meals;

  // Filter the meals by location
  const filteredMeals = meals.filter(meal => {
    if (locCookie.includes(meal.dispoart_id)) {
      return false;
    }
    // Filter the meals by protein used
    if (protCookie.some(protein => extractAdditiveCodes(meal.zsnummern).includes(protein))) {
      return false;
    }
    // Filter the meals by additives
    if (adiCookie.some(additive => extractAdditiveCodes(meal.zsnummern).includes(additive))) {
      return false;
    }
    return true;
  });

  return filteredMeals;
}

function applyFilter(locCookie, protCookie, adiCookie, meal) {
  if(!locCookie || !protCookie || !adiCookie) return true;

    // Filter the meals by location
    if (locCookie.includes(meal.dispoart_id)) {
      return false;
    }
    // Filter the meals by protein used
    if (protCookie.some(protein => extractAdditiveCodes(meal.zsnummern).includes(protein))) {
      return false;
    }
    // Filter the meals by additives
    if (adiCookie.some(additive => extractAdditiveCodes(meal.zsnummern).includes(additive))) {
      return false;
    }
    return true;
}



export { applyFilter, applyFilterList };
