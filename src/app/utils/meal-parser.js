"use server"

import { Bold } from 'lucide-react';

const murmur = require('murmurhash');
const priceRelationsLookup = {
    "Port.": { "stu": "3,50 €", "bed": "5,30 €", "gas": "6,25 €" }, 
    "Port.I": { "stu": "4,10 €", "bed": "6,10 €", "gas": "7,05 €" },
    "Port.II": { "stu": "3,80 €", "bed": "5,80 €", "gas": "6,90 €" },
    "Port.III": { "stu": "2,50 €", "bed": "3,85 €", "gas": "4,80 €" },
    "BIO Pasta (VK)": { "stu": "4,00 €", "bed": "4,00 €", "gas": "4,00 €" },
    "Salat / Teller": { "stu": "0,65 €", "bed": "0,95 €", "gas": "1,25 €" },
    "Wok I / Teller": { "stu": "0,70 €", "bed": "1,00 €", "gas": "1,30 €" },
    "Wok II / Teller": { "stu": "0,90 €", "bed": "1,20 €", "gas": "1,50 €" },
    "Wok III / Portion": { "stu": "3,50 €", "bed": "5,30 €", "gas": "6,25 €" },
    "Wok IV / Portion": { "stu": "3,80 €", "bed": "5,80 €", "gas": "6,90 €" },
    "Wok V / Portion": { "stu": "4,80 €", "bed": "6,80 €", "gas": "7,75 €" },
    "Wok VI / Portion": { "stu": "4,90 €", "bed": "6,90 €", "gas": "7,85 €" },
    "Wok VII / Portion": { "stu": "5,00 €", "bed": "7,00 €", "gas": "7,95 €" },
    "Wok VIII / Portion": { "stu": "5,10 €", "bed": "7,10 €", "gas": "8,05 €" },
    "Wok IX / Portion": { "stu": "5,20 €", "bed": "7,20 €", "gas": "8,15 €" },
    "Wok X / Portion": { "stu": "5,30 €", "bed": "7,30 €", "gas": "8,25 €" },
    "Wok XI / Portion": { "stu": "5,40 €", "bed": "7,40 €", "gas": "8,35 €" },
    "Wok XII / Portion": { "stu": "5,50 €", "bed": "7,50 €", "gas": "8,45 €" },
    "Wok XIII / Portion": { "stu": "5,60 €", "bed": "7,60 €", "gas": "8,55 €" },
    "Wok XIV / Portion": { "stu": "5,70 €", "bed": "7,70 €", "gas": "8,65 €" },
    "Wok XV / Portion": { "stu": "5,80 €", "bed": "7,80 €", "gas": "8,75 €" },
    "Wok XVI / Portion": { "stu": "5,90 €", "bed": "7,90 €", "gas": "8,85 €" },
    "Grill / I": { "stu": "2,50 €", "bed": "3,85 €", "gas": "4,80 €" },
    "Grill / II": { "stu": "2,45 €", "bed": "4,45 €", "gas": "5,40 €" },
    "Grill / III": { "stu": "2,70 €", "bed": "4,70 €", "gas": "5,65 €" },
    "Grill / IV": { "stu": "2,90 €", "bed": "4,90 €", "gas": "5,85 €" },
    "Grill / V": { "stu": "3,20 €", "bed": "5,20 €", "gas": "6,15 €" },
    "Grill / VI": { "stu": "3,45 €", "bed": "5,45 €", "gas": "6,40 €" },
    "Grill / VII": { "stu": "3,70 €", "bed": "5,70 €", "gas": "6,65 €" },
    "Grill / VIII": { "stu": "3,90 €", "bed": "5,90 €", "gas": "6,85 €" },
    "Grill / IX": { "stu": "4,20 €", "bed": "6,20 €", "gas": "7,15 €" },
    "Grill / X": { "stu": "4,45 €", "bed": "6,45 €", "gas": "7,40 €" },
    "Grill / XI": { "stu": "4,70 €", "bed": "6,70 €", "gas": "7,65 €" },
    "Grill / XII": { "stu": "4,90 €", "bed": "6,90 €", "gas": "7,85 €" },
    "Grill / XIII": { "stu": "5,20 €", "bed": "7,20 €", "gas": "8,15 €" },
    "Grill / XIV": { "stu": "5,70 €", "bed": "7,70 €", "gas": "8,65 €" },
    "Grill / XV": { "stu": "6,20 €", "bed": "8,20 €", "gas": "9,15 €" },
    "Grill / XVI": { "stu": "7,20 €", "bed": "9,20 €", "gas": "10,15 €" },
    // Bereich: Cafeteria
    "Eintopf I": { "stu": "1,20 €", "bed": "1,80 €", "gas": "2,10 €" },
    "Eintopf II": { "stu": "1,70 €", "bed": "2,60 €", "gas": "3,10 €" },
    "Tagessuppe": { "stu": "0,70 €", "bed": "1,00 €", "gas": "1,20 €" },
    "Essen feelgood (VK)": { "stu": "3,95 €", "bed": "5,70 €", "gas": "6,65 €" },
    "Essen feelgood": { "stu": "3,50 €", "bed": "5,05 €", "gas": "6,00 €" },
    // Cafeteria Mittagsmenü
    "Warmer Snack / Imbiss (1)": { "price": "1,30 €" },
    "Warmer Snack / Imbiss (2)": { "price": "1,65 €" },
    "Warmer Snack / Imbiss (3)": { "price": "1,80 €" },
    "Warmer Snack / Imbiss (16)": { "price": "1,90 €" },
    "Pizzaschnitte": { "price": "1,95 €" },
    "Warmer Snack / Imbiss (4)": { "price": "2,15 €" },
    "Warmer Snack / Imbiss (5)": { "price": "2,30 €" },
    "Warmer Snack / Imbiss (6)": { "price": "2,50 €" },
    "Warmer Snack / Imbiss (14)": { "price": "2,65 €" },
    "Warmer Snack / Imbiss (18)": { "price": "2,80 €" },
    "Warmer Snack / Imbiss (7)": { "price": "2,90 €" },
    "Warmer Snack / Imbiss (8)": { "price": "3,00 €" },
    "Warmer Snack / Imbiss (17)": { "price": "3,20 €" },
    "Warmer Snack / Imbiss (9)": { "price": "3,30 €" },
    "Warmer Snack / Imbiss (19)": { "price": "3,40 €" },
    "Warmer Snack / Imbiss (10)": { "price": "3,50 €" },
    "Warmer Snack / Imbiss (11)": { "price": "3,60 €" },
    "Warmer Snack / Imbiss (12)": { "price": "3,90 €" },
    "Warmer Snack / Imbiss (13)": { "price": "4,20 €" },
    "Warmer Snack / Imbiss (20)": { "price": "4,30 €" },
    "Warmer Snack / Imbiss (21)": { "price": "4,40 €" },
    "Warmer Snack / Imbiss (15)": { "price": "4,50 €" },
    "Warmer Snack / Imbiss (22)": { "price": "4,60 €" },
    "Warmer Snack / Imbiss (23)": { "price": "4,70 €" },
    "Warmer Snack / Imbiss (24)": { "price": "5,90 €" },
    "Warmer Snack / Imbiss (25)": { "price": "4,80 €" },
    "Warmer Snack / Imbiss (26)": { "price": "4,90 €" },
    "Warmer Snack / Imbiss (27)": { "price": "5,00 €" },
    "Warmer Snack / Imbiss (28)": { "price": "5,20 €" },
    "Warmer Snack / Imbiss (29)": { "price": "5,40 €" },
    "Warmer Snack / Imbiss (30)": { "price": "5,50 €" },
    "Warmer Snack / Imbiss (31)": { "price": "5,60 €" },
    "Warmer Snack / Imbiss (32)": { "price": "5,70 €" },
    "Warmer Snack / Imbiss (33)": { "price": "5,90 €" },
    "Warmer Snack / Imbiss (34)": { "price": "6,00 €" },
};

const taggedStrings = ["Vegetarisches Menü[1]:", "Plant-based Menü[1]:", "Veganes Menü[1]:"]

let cachedMenuData = null;
let lastMenuCachedAt = 0;

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
  return target.map(s => strings.reduce((acc, cur) => acc.replace(cur, ""), s));
}
function detectMealVariations(target, strings) {
  return target.filter(s => strings.some(cur => s.includes(cur)));
}

function stripAdditivesFromArray(target) {
  return target.map(s => s.replace(/\s*\([0-9A-Za-zÄäÖöÜüß.,\/\-\s]+\)\s*$/g, "").trim());
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

function detectAltVariant(target) {
  for (let i = 0; i < target.length; i++) {
    if (target[i].includes("Vegetarisches Menü")) return 1;
    if (target[i].includes("Plant-based Menü") || target[i].includes("Veganes Menü")) return 2;
  }
  return 0;
}

async function fetchMensaData() {
  // trycatch
  try {
    const [studiApi, legacyApi] = await Promise.all([
      fetch(
        "https://www.studierendenwerk-kaiserslautern.de/fileadmin/templates/stw-kl/loadcsv/load_db_speiseplan.php?canteens=1",
        {
          method: "GET",
          next: { revalidate: 1800 },
          headers: {
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        }
      ).then((response) => response.json()),
      fetch("https://www.mensa-kl.de/api.php?format=json&date=all", {
          method: "GET",
          next: { revalidate: 1800 },
          headers: {
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
      }).then((response) => response.json()),
    ]);
    return {studiApi, legacyApi};
  } catch (error) {
    console.warn("Network error or server not responding:", error.message);
  }
}

async function ParseMenu() {

    // Invalidate cache if no last cachedate exists, length of data is 0 or last cached date is older than 3 hours or the schedule is from yesterday
    if (lastMenuCachedAt && cachedMenuData?.length > 0 && (Date.now() - lastMenuCachedAt) < 3 * 60 * 60 * 1000 && isToday(lastMenuCachedAt)) {
      return cachedMenuData;
    }


    const inputData = await fetchMensaData();

    let menuData = [];

    // Filter out everything exept robotic kitchen and kl mensa
    const lfStudiApi = inputData.studiApi.filter(item => item.ort_id === 310 || item.ort_id === 410);

    const rawLegacyApi = inputData?.legacyApi;

    // Iterate over meals and yes there are 8
    for (let i = 0; i < lfStudiApi.length; i++) {
      const obj = lfStudiApi[i];

      // this is fast
      const mergedTitleList = [
        obj.atextohnezsz1,
        obj.atextohnezsz2
          ? (obj.atextohnezsz2.startsWith(",") ? "" : " ") + obj.atextohnezsz2
          : "",
        obj.atextohnezsz3
          ? (obj.atextohnezsz3.startsWith(",") ? "" : " ") + obj.atextohnezsz3
          : "",
        obj.atextohnezsz4
          ? (obj.atextohnezsz4.startsWith(",") ? "" : " ") + obj.atextohnezsz4
          : "",
        obj.atextohnezsz5
          ? (obj.atextohnezsz5.startsWith(",") ? "" : " ") + obj.atextohnezsz5
          : "",
        obj.atextohnezsz6
          ? (obj.atextohnezsz6.startsWith(",") ? "" : " ") + obj.atextohnezsz6
          : "",
        obj.atextohnezsz7
          ? (obj.atextohnezsz7.startsWith(",") ? "" : " ") + obj.atextohnezsz7
          : "",
        obj.atextohnezsz8
          ? (obj.atextohnezsz8.startsWith(",") ? "" : " ") + obj.atextohnezsz8
          : "",
      ].filter(Boolean);

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

      // Create usable title array
      const title = removeUnwantedStrings(mergedTitleList, taggedStrings);

      // Create usable alt shortile
      const altOption = removeUnwantedStrings(
        detectMealVariations(stripAdditivesFromArray(mergedATitleList),taggedStrings), taggedStrings).flatMap((s) => s.slice(1, -1)).join("").trim();

      // Create usable additives list synced with the title
      const additivesMap = extractAdditivesAsArray(mergedATitleList);

      // Identify sibling in other dataset
      const matchKey = title.flat().join("").toLowerCase().replace(/[^a-z]/g, "");
      const sisterItem = rawLegacyApi.find((item) => item.title.replace(/&quot;/g, "").toLowerCase().replace(/[^a-z]/g, "").includes(matchKey));
      const brotherItem = rawLegacyApi.find(option => option?.loc === sisterItem?.loc && option?.date === sisterItem?.date && option?.m_id !== sisterItem?.m_id);

      const altType = detectAltVariant(mergedATitleList);

      menuData.push({
        date: obj?.proddatum,
        title,
        altOption,
        altType,
        additivesMap,
        murmurID,
        price: priceRelationsLookup[obj.artgebname],
        menuekennztext: obj?.menuekennztext,
        dpartname: obj?.dpartname,
        dpname: obj?.dpname,
        zsnumnamen: obj?.zsnumnamen,
        zsnummern: obj?.zsnummern,
        dispoart_id: obj?.dispoart_id,
        mergedFreitextList,
        legacyId:sisterItem?.m_id,
        rating: sisterItem?.rating,
        rating_amt: sisterItem?.rating_amt,
        image: sisterItem?.image,
        imageUrl: sisterItem?.image_url_webp,
        altRating: brotherItem?.rating,
        altRting_amt: brotherItem?.rating_amt,
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

  // Cache menu data
  cachedMenuData = parsedMenu;
  lastMenuCachedAt = Date.now();

  // fire
  return parsedMenu;
}

export default ParseMenu;