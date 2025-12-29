
function applyFilterList(locCookie, protCookie, adiCookie, meals) {
  if(!locCookie || !protCookie || !adiCookie) return meals;

  const rebuildMeals = [];
  for (let index = 0; index < meals.length; index++) {
    const meal = meals[index];

    // Filter for locations
    if (locCookie.includes(meal.dispoart_id)) {
      continue;
    }
    
    // Set up lists for filtering
    const regAdditives = meal?.titleRegAdditives?.flat() || [];
    const altAdditives = meal?.titleAltAdditives?.flat() || [];
    const generalAdditives = meal.zsnummern;

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
    let hitCounter = false;
    let outputMeal = meal;
    if(r_test_1 || a_test_1 || r_test_2 || a_test_2) {
      if(r_test_1 || r_test_2) {
        // reg hits filter
        outputMeal = { ...meal, partialFiltered: 1 };
        hitCounter = true;
      }
      if(a_test_1 || a_test_2) {
        // alt hits filter
        if(hitCounter) {
          // Both variants are contaminated! Remove
          continue;
        }
        outputMeal = { ...meal, partialFiltered: 1 };
      }
    }

    rebuildMeals.push(outputMeal);
  }

  return rebuildMeals;
}



export { applyFilterList };
