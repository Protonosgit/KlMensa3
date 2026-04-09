"use client";


async function requestUserData() {
    try {
        const tokenString = getCookie("account_data"); // adapt to new cookie schema
        const response = await fetch(`${process.env.NEXT_PUBLIC_LEGACY_API_URL}/api/v1/about-user`, { method: 'GET', headers: { Authorization: `Bearer ${tokenString}` }});
        const user = await response.json();

        return { error: "", data: user };
    } catch (error) {
        return { error: "Server issue", data: null };
    }
}


function getCookie(name) {
    const cookies = document.cookie
        .split(';')
        .map(c => c.trim())
        .reduce((acc, cookie) => {
            const [key, val] = cookie.split('=');
            acc[key] = decodeURIComponent(val || '');
            return acc;
        }, {});
    
    const value = cookies[name];
    if (!value) return null;
    
    // Auto-parse JSON
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
    document.cookie = `${name}=${encodeURIComponent(stringValue)}; ${expires}; path=/; SameSite=Strict`;
}


export { setCookie, getCookie };