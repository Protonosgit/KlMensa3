const  priceRelationsLookup = {
    // artgebname : price
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


async function fetchMenu() {
    try {
        // download latest uncached version of the mensa menu
        const response = await fetch('https://www.studierendenwerk-kaiserslautern.de/fileadmin/templates/stw-kl/loadcsv/load_db_speiseplan.php?canteens=1', {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Content-Type': 'application/json'
            }
        });
        // Check if request went through
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Error fetching menu: ${response.status} ${response.statusText}\n${errorMessage}`);
            return null;
        }

        // parse response
        const menuSchedule = await parseMenu(await response.json());

        // return new Promise((resolve) => setTimeout(() => resolve(menuSchedule), 3000));
        return menuSchedule;
    } catch (error) {
        console.error('Network error or server not responding:', error.message);
        return null;
    }
}


async function fetchMealUserData() {
    try {
        // download latest uncached version of the mensa menu
        const response = await fetch('https://www.mensa-kl.de/api.php?format=json&date=all', {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Content-Type': 'application/json'
            }
        });
        // Check if request went through
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Error fetching menu: ${response.status} ${response.statusText}\n${errorMessage}`);
            return null;
        }

        // parse response
        const menuSchedule = await response.json();

        return menuSchedule;
    } catch (error) {
        console.error('Network error or server not responding:', error.message);
        return null;
    }
}



async function parseMenu(menuData) {
    const locationFiltered = menuData.filter(item => item.ort_id === 310 || item.ort_id === 410);
    
    const combinedKeys = locationFiltered.map(obj => {
      return {
        ...obj,
        titleCombined: ((obj.atextohnezsz1 || '') +" "+ (obj.atextohnezsz2 || '') +" "+ (obj.atextohnezsz3 || '' ) +" "+ (obj.atextohnezsz4 || '') +" "+ (obj.atextohnezsz5 || '')).trim(),
        titleAdditivesCombined: ((obj.atextz1 || '') +" "+ (obj.atextz2 || '') +" "+ (obj.atextz3 || '' ) +" "+ (obj.atextz4 || '') +" "+ (obj.atextz5 || '')).trim(),
        price: priceRelationsLookup[obj.artgebname]?.stu || priceRelationsLookup[obj.artgebname]?.price,
      };
    });

    const matchedMenu = await matchMenuToUdat(combinedKeys);

    const groupedByDate = matchedMenu.reduce((acc, item) => {
      const key = item.proddatum;
    
      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(item);
      return acc;
    }, {});

    const updatedmenu = Object.entries(groupedByDate).map(([date, items]) => {
        return {
            date,
            meals: items
        };
    });
    
    return updatedmenu
}
async function matchMenuToUdat(schedule) {
    const rebuildmatchedMenu = schedule;

    try {
        const userdat = await fetchMealUserData();
        if (!userdat || !Array.isArray(userdat) || userdat.length === 0) {
            console.error('Failed to parse menu schedule');
        return rebuildmatchedMenu;
        }

        for (const entry of rebuildmatchedMenu) {
            const titleCollector = (entry.atextohnezsz1+entry.atextohnezsz2).toLowerCase().replace(/[^a-z]/g, '');

            for (const udatEntry of userdat) {
                const udatTitle = udatEntry?.title.replace(/&quot;/g, '"').toLowerCase().replace(/[^a-z]/g, '');

                if (udatTitle.includes(titleCollector)) {
                    if(udatEntry.image){
                        entry.image = udatEntry.image;
                    }
                    if(udatEntry.rating){
                        entry.rating = udatEntry.rating;
                    }
                    if(udatEntry.rating_amt){
                        entry.rating_amt = udatEntry.rating_amt;
                    }
                }
            }
        }

        return rebuildmatchedMenu
    } catch (error) {
        return rebuildmatchedMenu
    }
}


export { fetchMenu, fetchMealUserData }