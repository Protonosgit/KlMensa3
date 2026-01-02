"use client";


async function requestUserData() {
    try {
        const tokenString = getCookie("access_token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_LEGACY_API_URL}/api/v1/about-user`, { method: 'GET', headers: { Authorization: `Bearer ${tokenString}` }});
        const user = await response.json();

        return { error: "", data: user };
    } catch (error) {
        return { error: "Server issue", data: null };
    }
}

async function rateMeal(legacyId, stars) {
    return null; // Moved to server because cors is ####
    if(stars < 1 || stars > 5) {
        return { error: "Invalid rating", data: null };
    }
    try {
        console.log(legacyId, stars);
        const tokenString = getCookie("access_token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_LEGACY_API_URL}/api/v1/rate-meal`, { method: 'POST',body: { meal_id: legacyId, rating: stars }, headers: { Authorization: `Bearer ${tokenString}` }});
        console.log(response);
        const result = await response.json();
        console.log(result);

        return { error: "", data: result };
    } catch (error) {
        console.log(error);
        return { error: "Server issue", data: null };
    }
}


function setCookie(name, value, days) {
    if (typeof days !== "number" || days <= 0) {
        days = 60*60*24*365;
    }
    const expires = "; expires=" + new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


export { setCookie, getCookie, rateMeal };