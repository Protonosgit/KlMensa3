"use client";

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

export { setCookie, getCookie }