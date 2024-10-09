import { parseString } from 'xml2js';

async function fetchFullSchedule() {
    
    const response = await fetch('https://www.mensa-kl.de/?mode=mensaxml', {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Type': 'application/xml'
        }
    });

    const schedule = parseMensaSchedule(await response.text());

    return schedule?.mensa?.day;
}


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



export { fetchFullSchedule }