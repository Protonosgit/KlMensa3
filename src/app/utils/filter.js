"use client";

import { extractAdditives } from "./additives";

function locFilter(meal, cookies) {
    if(meal === null || cookies === null) return true
    if(cookies.length < 10) return true

    switch(meal.loc) {
        case "1":
            return cookies[0].shown;
        case "2":
            return cookies[0].shown;
        case "1veg":
            return cookies[1].shown;
        case "1vegan":
            return cookies[1].shown;
        case "2vegan":
            return cookies[1].shown;
        case "2veg":
            return cookies[1].shown;
        case "Wok":
            return cookies[2].shown;
        case "Grill":
            return cookies[3].shown;
        case "Buffet":
            return cookies[4].shown;
        case "AtriumMenü":
            return cookies[5].shown;
        case "AtriumMenüVegan":
            return cookies[6].shown;
        case "SalatbufettV+":
            return cookies[7].shown;
        case "Abend":
            return cookies[8].shown;
        case "AbendVegan":
            return cookies[9].shown;
        case "News":
            return cookies[10].shown;
        default:
            return true
    }
}

function protFilter(meal, cookies) {
    if(meal === null || cookies === null) return true
    if(cookies.length < 6) return true

    switch(meal.icon) {
        case "pork":
            return cookies[0].shown;
        case "beef":
            return cookies[1].shown;
        case "chicken":
            return cookies[2].shown;
        case "fish":
            return cookies[3].shown;
        case "boar":
            return cookies[4].shown;
        case "sheep":
            return cookies[5].shown;
        case "duck":
            return cookies[6].shown;
        case "berk":
            return cookies[0].shown && cookies[1].shown;
        case "":
            return cookies[7].shown;
        default:
            return true
    }
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
