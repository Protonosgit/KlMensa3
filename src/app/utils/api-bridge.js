import { parseString } from 'xml2js';

// test not used
async function fetchFullSchedule() {
    
    const response = await fetch('https://www.mensa-kl.de/?mode=mensaxml', {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Type': 'application/xml',
            'User-Agent': 'mensa-kl/3.0',
            'Accept': 'application/xml'
        }
    });

    const schedule = parseMensaSchedule(await response.text());

    return schedule?.mensa?.day;
}
// test not used anymore
function parseMensaSchedule(xmlData) {
    //const xml = xmlData.replace("\ufeff", "");
    let finalschedule;

    parseString(xmlData, {trim: true}, function (err, result) {
        if (err) {
            console.log(err)
            return
        }
        finalschedule = result
    });

    return finalschedule
}

async function fetchMenu() {
    try {
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

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Error fetching menu: ${response.status} ${response.statusText}\n${errorMessage}`);
            return null; // Return null instead of throwing an error
        }

        const menuSchedule = parseMenu(await response.json());

        if (!menuSchedule || !Array.isArray(menuSchedule) || menuSchedule.length === 0) {
            console.error('Failed to parse menu schedule');
            return null; // Return null instead of throwing an error
        }


        // return new Promise((resolve) => setTimeout(() => resolve(menuSchedule), 3000));

        return menuSchedule;
    } catch (error) {
        console.error('Network error or server not responding:', error.message);
        return null; // Return null for any network errors
    }
}

function parseMenu(menuData) {
    let pastdate = menuData[0].date;
    let menucollect = []
    const schedule = [];
    for (let i = 0; i < menuData.length; i++) {

        if(pastdate != menuData[i].date) {
            schedule.push({meals: menucollect, date: menuData[i-1].date})
            pastdate = menuData[i].date
            menucollect = []
        }

        menucollect.push({...menuData[i], loc_clearname: generateClearLocation(menuData[i].loc), loc_link: generateMapsLink(menuData[i].loc)})
    }
    if(menucollect.length > 0) {
        schedule.push({meals: menucollect, date: menuData[menuData.length-1].date})
    }
    //console.log(schedule[0].date)

    return schedule;
}

function generateClearLocation(loc) {
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
        default:
            return loc

    }
}

function generateMapsLink(loc) {
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

export { fetchFullSchedule,fetchMenu }