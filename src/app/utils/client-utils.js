"use client";


async function requestUserData() {
    try {
        const res = await fetch('https://www.mensa-kl.de/api/v1/about-user', { method: 'GET', headers: { Authorization: `Bearer ${tokenString}` }});
        const user = await res.json();

        return { error: "", data: user };
    } catch (error) {
        return { error: "Server issue", data: null };
    }
}

async function submitRating(legacyId, stars) {
    try {
        const res = await fetch('https://www.mensa-kl.de/api/v1/send-stars', { method: 'GET',body: { legacyId: legacyId, stars: stars }, headers: { Authorization: `Bearer ${tokenString}` }});
        const result = await res.json();

        return { error: "", data: user };
    } catch (error) {
        return { error: "Server issue", data: null };
    }
}

async function deleteRating(legacyId) {
    try {
        const res = await fetch('https://www.mensa-kl.de/api/v1/delete-stars', { method: 'GET', body: { legacyId: legacyId }, headers: { Authorization: `Bearer ${tokenString}` }});
        const result = await res.json();

        return { error: "", data: user };
    } catch (error) {
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


export { setCookie, getCookie };