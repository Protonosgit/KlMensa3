// Testing new way of retrieving the menu from the swk server without rating or images
async function fetchMenuOrigin() {
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

        // Catch any parsing errors
        if (!menuSchedule || !Array.isArray(menuSchedule) || menuSchedule.length === 0) {
            console.error('Failed to parse menu schedule');
            return null;
        }

        // return new Promise((resolve) => setTimeout(() => resolve(menuSchedule), 3000));
        return menuSchedule;
    } catch (error) {
        console.error('Network error or server not responding:', error.message);
        return null;
    }
}
async function fetchMenu() {
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
        const menuSchedule = parseMenu(await response.json());

        // Catch any parsing errors
        if (!menuSchedule || !Array.isArray(menuSchedule) || menuSchedule.length === 0) {
            console.error('Failed to parse menu schedule');
            return null;
        }

        // return new Promise((resolve) => setTimeout(() => resolve(menuSchedule), 3000));
        return menuSchedule;
    } catch (error) {
        console.error('Network error or server not responding:', error.message);
        return null;
    }
}

function parseMenu(menuData) {
    let pastdate = menuData[0].date;
    let menucollect = []
    const schedule = [];
    // Split schedule in different days
    for (let i = 0; i < menuData.length; i++) {
        // day to schedule if day has changed
        if(pastdate != menuData[i].date) {
            schedule.push({meals: menucollect, date: menuData[i-1].date})
            pastdate = menuData[i].date
            menucollect = []
        }
        // Append meal to day
        menucollect.push({...menuData[i], loc_clearname: generateClearLocation(menuData[i].loc), title: menuData[i].title.replace(/&quot;/g, '"'), loc_link: generateMapsLink(menuData[i].loc)})
    }
    // Push last day to schedule
    if(menucollect.length > 0) {
        schedule.push({meals: menucollect, date: menuData[menuData.length-1].date})
    }

    return schedule;
}

function generateClearLocation(loc) {
    // Convert location codes to readable names
    switch(loc) {
        case "1":
            return "Ausgabe 1"
        case "2":
            return "Ausgabe 2"
        case "1veg":
            return "Ausgabe 1 vegan"
        case "2veg":
            return "Ausgabe 2 vegan"
        case "1vegan":
            return "Ausgabe 1 vegan"
        case "2vegan":
            return "Ausgabe 2 vegan"
        case "AtriumMenüVegan":
            return "Atrium Menue Vegan"
        case "AtriumMenü":
            return "Atrium Menue"
        case "Abend":
            return "Abendmensa"
        case "AbendVegan":
            return "Abendmensa Vegan"
        case "SalatbufettV+":
            return "Salatbufett Vegan"  
        case "RK":
            return "Robotic Kitchen"    
        default:
            return loc

    }
}

function generateMapsLink(loc) {
    // Append maps link to locations
    switch(loc) {
        case "1":
            return "https://www.google.com/maps/place/49.425171,7.750353"
        case "2":
            return "https://www.google.com/maps/place/49.425129,7.750617"
        case "1veg":
            return "https://www.google.com/maps/place/49.425171,7.750353"
        case "1vegan":
            return "https://www.google.com/maps/place/49.425171,7.750353"
        case "2vegan":
            return "https://www.google.com/maps/place/49.425129,7.750617"
        case "Grill":
            return "https://maps.app.goo.gl/o25qX5cvWBMJQUeD9"
        case "Abend":
            return "https://maps.app.goo.gl/EoysAuqrYrndG69w7"
        case "AbendVegan":
            return "https://maps.app.goo.gl/EoysAuqrYrndG69w7"
        default:
            return "https://maps.app.goo.gl/kTgdA5TwexxrxRUA8"

    }
}

export { fetchMenu }