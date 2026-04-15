"use server"
import { unstable_cache } from "next/cache"
import { extractAdditives, extractAdditiveCodes } from './additives';
import murmur from 'murmurhash';
import { decode } from "he";


// List of tags that indicate veggie or vegan
// Due to someone making frequent typos this list contains some very special variants which should not be considered as a mistake on my side ;)
//
const veggieIndexTags = ["Vegetarisches Menü[1]:", "Vegetarischer Bagel[1]:", "Vegetarisches Menü[2]:"];
const veganIndexTags = ["Veganes Menü[1]:", "Veganuary Menü[1]:", "Plant-based Menü[1]:", "Plant based Menü[1]:", "Plant-based Menü[2]:", "Plant based Menü[2]:"];
const additionalConTags = ["[1]:", "[2]:", "1]:", "2]:"]; // not used
const taggedStrings = [...veggieIndexTags, ...veganIndexTags];

function isToday(timestamp) {
  const inputDate = new Date(timestamp);
  const today = new Date();

  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  );
}

function removeUnwantedStrings(target, strings) {
  return target.map(s => strings.reduce((acc, cur) => acc.replace(cur, "@&@"), s));
}

function stripAdditivesFromArray(target) {
  return target.map(s =>
    s.replace(/\s*\(([0-9A-Za-zÄäÖöÜüß.,\/\-\s]+)\)\s*$/g, (match, inside) =>
      inside.includes("@&@") ? match : ""
    ).replace("@&@", "").replace(/[\(\)]/g, "")
  );
}
function extractAdditivesAsArray(target) {
  const regex = /\(([^)]+)\)/g;
  return target.map(part => {
    if (!part) return [];
    const matches = [...part.matchAll(regex)];
    const additives = [];
    for (const match of matches) {
      const additiveString = match[1];
      const additiveCodes = additiveString
        .split(',')
        .map(code => code.trim().toLowerCase())
        .filter(token => /^[0-9a-z]+$/.test(token));
      additives.push(...additiveCodes);
    }
    return additives;
  });
}

function splitNormalAndVariant(aTitleList) {
  const variantIList = [];

  let normList = [];
  let variList = [];


  const oderIndex = aTitleList.findIndex(element => element.trim().includes("oder:"));
  if(oderIndex !== -1) {
    // Meal contains alternative without spacifications (veggi/vegan)
    normList = aTitleList.slice(0, oderIndex);
    variList = aTitleList.slice(oderIndex+1);

    return [normList, variList];
  }

  // locate the index of strings which contain a meal variant
  for (let i = 0; i < aTitleList.length; i++) {
    const element = aTitleList[i];
    taggedStrings.some(tag => element.includes(tag)) ? variantIList.push(i) : null;
  }

    //Split the list
  for (let i = 0; i < aTitleList.length; i++) {
    // to regular
    if(!variantIList.includes(i)) {
      normList.push(aTitleList[i]);
    }
    // and variant
    if(variantIList.includes(i) || (!variantIList.includes(i + 1) && !aTitleList.join().includes("[2]"))) {
      variList.push(aTitleList[i]);
    }

  }

  return [normList, variList];
}


function detectAltVariant(target) {
  for (let i = 0; i < target.length; i++) {
    if (veggieIndexTags.some(tag => target[i].includes(tag))) return 1;
    if (veganIndexTags.some(tag => target[i].includes(tag))) return 2;
    if (target[i].trim().toLowerCase() === "oder:") return 3;
  }
  return 0;
}

async function fetchMensaData() {
  try {
    const [studiResult, legacyResult] = await Promise.allSettled([
      fetch(
        "https://www.studierendenwerk-kaiserslautern.de/fileadmin/templates/stw-kl/loadcsv/load_db_speiseplan.php?canteens=1",
        {
          method: "GET",
          // next: { revalidate: 1000 },
          headers: {
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        }
      ).then((r) => r.json()),

      fetch("https://www.mensa-kl.de/api.php?format=json&date=all", {
        method: "GET",
        headers: {
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }).then((r) => r.json()),
    ]);

    return {
      studiApi: studiResult.status === "fulfilled" ? studiResult.value : [],
      legacyApi: legacyResult.status === "fulfilled" ? legacyResult.value : [],
    };
  } catch (error) {
    console.warn("Unexpected error:", error.message);
    return { studiApi: [], legacyApi: [] };
  }
}

async function ParseMenu() {
    const inputData = await fetchMensaData();

    let menuData = [];

    // Filter out everything exept robotic kitchen and kl mensa
    const lfStudiApi = inputData.studiApi.filter(item => item.ort_id === 310 || item.ort_id === 410);

    const rawLegacyApi = inputData?.legacyApi;

    // Iterate over meals
    for (let i = 0; i < lfStudiApi.length; i++) { // DEBUG !!!!! for (let i = 0; i < lfStudiApi.length; i++) {
      const obj = lfStudiApi[i];

      // this is fast but ugly
      const mergedATitleList = [
        obj.atextz1,
        obj.atextz2
          ? (obj.atextz2.startsWith(",") ? "" : " ") + obj.atextz2
          : "",
        obj.atextz3
          ? (obj.atextz3.startsWith(",") ? "" : " ") + obj.atextz3
          : "",
        obj.atextz4
          ? (obj.atextz4.startsWith(",") ? "" : " ") + obj.atextz4
          : "",
        obj.atextz5
          ? (obj.atextz5.startsWith(",") ? "" : " ") + obj.atextz5
          : "",
        obj.atextz6
          ? (obj.atextz6.startsWith(",") ? "" : " ") + obj.atextz6
          : "",
        obj.atextz7
          ? (obj.atextz7.startsWith(",") ? "" : " ") + obj.atextz7
          : "",
        obj.atextz8
          ? (obj.atextz8.startsWith(",") ? "" : " ") + obj.atextz8
          : "",
      ].filter(Boolean);


      const mergedFreitextList = [
        obj?.frei1,
        obj?.frei2
          ? (obj?.frei2.startsWith(",") ? "" : " ") + obj?.frei2
          : "",
        obj?.frei3
          ? (obj?.frei3.startsWith(",") ? "" : " ") + obj?.frei3
          : "",
      ].filter(Boolean);

      // create usable hash from title
      //const murmurID2 = murmur.v3(mergedATitleList.join("")).toString(16).substring(0, 8);// The following system is much better but the ai dataset would be broken if we change it
      const murmurID = murmur
        .v3(
          mergedATitleList[0] +
            mergedATitleList[1] +
            mergedATitleList[2] +
            mergedATitleList[3] +
            mergedATitleList[4] +
            mergedATitleList[5] +
            mergedATitleList[6] +
            mergedATitleList[7]
        ).toString(16).substring(0, 8);

      // Detect which type of variant the meal is (vegan, veggi)
      const altType = detectAltVariant(mergedATitleList);

      // perform title split
      const splitTitles = splitNormalAndVariant(mergedATitleList);

      // Create usable title array
      const titleRegTmp = splitTitles[0];
      const titleReg = stripAdditivesFromArray(titleRegTmp);

      // Create usable alt title array
      const titleAltTmp = removeUnwantedStrings(splitTitles[1], taggedStrings);
      const titleAlt = stripAdditivesFromArray(titleAltTmp);

      // Create usable additives list synced with the title
      const titleRegAdditives = extractAdditivesAsArray(titleRegTmp);
      const titleAltAdditives = extractAdditivesAsArray(titleAltTmp);

      // Extract additives from string to array
      const commonAdditives = extractAdditives(obj?.zsnumnamen);
      const commonAdditiveCodes = extractAdditiveCodes(obj?.zsnummern); // for filter only

      // Identify sibling in other dataset
      const matchKey = titleReg?.flat().join("").toLowerCase().replace(/[^a-z]/g, "");
      const altMatchKey = titleAlt?.flat().join("").toLowerCase().replace(/[^a-z]/g, "");
      // maybe index the oder: tag and split string when legacy api does nto want to fix this issue
      const sisterItem = rawLegacyApi.find((item) => decode(item?.title || "").toLowerCase().replace(/[^a-z]/g, "").includes(matchKey));
      const brotherItem = rawLegacyApi.find((item) => decode(item?.title || "").toLowerCase().replace(/[^a-z]/g, "").includes(altMatchKey));

      
      menuData.push({
        date: obj?.proddatum,
        murmurID,
        titleReg,
        titleAlt,
        altType,
        titleRegAdditives,
        titleAltAdditives,
        mergedFreitextList,
        price: [obj?.stu, obj?.bed, obj?.gas],
        menuekennztext: obj?.menuekennztext,
        dpartname: obj?.dpartname,
        dpname: obj?.dpname,
        zsnumnamen: commonAdditives,
        zsnummern: commonAdditiveCodes,
        dispoart_id: obj?.dispoart_id,
        legacyId:sisterItem?.m_id,
        rating: sisterItem?.rating,
        rating_amt: sisterItem?.rating_amt,
        image: sisterItem?.image,
        imageUrl: sisterItem?.image_url_webp,
        legacyId_alt:brotherItem?.m_id,
        altRating: brotherItem?.rating,
        altRating_amt: brotherItem?.rating_amt,
        altImage: brotherItem?.image,
        altImageUrl: brotherItem?.image_url_webp,
      });
    }

    // remove undefined values from meals in the future here:
    // menuData= menuData

    // Group by date
    const groupedByDate = Object.fromEntries(
      menuData.reduce((acc, item) => {
        acc.set(item.date, (acc.get(item.date) || []).concat(item));
        return acc;
      }, new Map())
    );


    const sortedGroupedByDate = Object.fromEntries(
        Object.entries(groupedByDate).sort(([a], [b]) => new Date(a) - new Date(b))
    );


    // Check if cutoff time has been reached and the slice todays date
    const today = new Date().toISOString().split('T')[0];
    const firstKey = Object.keys(sortedGroupedByDate)[0];
    const currentTime = new Date().getHours() * 60 * 60 + new Date().getMinutes() * 60 + new Date().getSeconds();
    const cutoffTime = 19 * 60 * 60 + 30 * 60;
    const cutGroupedByDate = (firstKey === today) && (currentTime > cutoffTime)
        ? Object.fromEntries(Object.entries(sortedGroupedByDate).slice(1))
        : sortedGroupedByDate;
    
    

    const parsedMenu = Object.entries(cutGroupedByDate).map(([date, items]) => {
        // Sort meals by dpartname works fine but disabled for now
        const predefinedOrder = ["Essen 1", "Essen 2", "Grill", "Wok", "Salatbüfett", "Eintopf 1", "Eintopf 2", "Mittagsmenü 1", "Mittagsmenü 2", "Mittagsmenü 3","Mittagsmenü 4", "Mittagsmenü 5", "Abendmensa"];
        const sortedMeals = items.slice().sort((a, b) => {
            const aIndex = predefinedOrder.indexOf(a.dpartname);
            const bIndex = predefinedOrder.indexOf(b.dpartname);
            if (aIndex < bIndex) return -1;
            if (aIndex > bIndex) return 1;
            return 0;
        });
        return {
            date,
            meals: sortedMeals
        };
    });

  // fire
  return parsedMenu;
}

const retrieveMenuCached = unstable_cache(
  async () => {
    return ParseMenu()
  },
  ["menu-data-full"], // key
  {
    revalidate: 1200, // 20min
    tags: ["json-data"],
  }
)
export {ParseMenu, retrieveMenuCached};