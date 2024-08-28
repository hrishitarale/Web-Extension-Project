function methodPOST(Api, req) {
    const res = fetch(`${Api}`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(req), // body data type must match "Content-Type" header
    }).then(response => {
        if (response?.ok) {
            return response.json(); // Parse the response data as JSON 
        } else {
            throw new Error('API request failed');
        }
    });
    return res;
}

const token = localStorage.getItem("userToken")
function methodGET(Api) {
    const res = fetch(`${Api}`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: new Headers({
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + token,
        }),
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(response => {
        if (response?.ok) {
            return response.json(); // Parse the response data as JSON 
        } else {
            throw new Error('API request failed');
        }
    });
    return res;
}
const translator_active = document.getElementById('translator_active');
const translator = document.getElementById('translator');
if (translator !== null && translator !== undefined) {
    translator.addEventListener('click', () => {
        isCheckTokenII('/web-Ui/user-panel/translator/translator.html');
    });
}
const welcome_active = document.getElementById('welcome_active');
const welcome = document.getElementById('welcome');
if (welcome !== null && welcome !== undefined) {
    welcome.addEventListener('click', () => {
        isCheckTokenII('/web-Ui/user-panel/landing-page/landing.html');
    });
}
const dictionary_active = document.getElementById('dictionary_active');
const dictionary = document.getElementById('dictionary');
if (dictionary !== null && dictionary !== undefined) {
    dictionary.addEventListener('click', () => {
        isCheckTokenII('/web-Ui/user-panel/dictionary/dictionary.html');
    });
}
const profile_active = document.getElementById('profile_active');
if (profile_active !== null && profile_active !== undefined) {
    profile_active.addEventListener('click', () => {
        // isCheckToken(cPath)
    });
}
const settings_active = document.getElementById('settings_active');
if (settings_active !== null && settings_active !== undefined) {
    settings_active.addEventListener('click', () => {
        logOut("/web-Ui/user-panel/login/login.html");
    });
}

const logOut = (cPath) => {
    setTimeout(() => {
        localStorage.removeItem('userToken');
        const theURL = window?.location?.href;
        window?.location.assign(theURL.replace(window?.location?.pathname, cPath));
    }, 1200);
}

function isCheckTokenII(cPath) {
    console.log(cPath);
    setTimeout(() => {
        const token = localStorage.getItem('userToken');
        const theURL = window?.location?.href;
        if (token !== null && token !== undefined && token !== '') {
            window?.location.assign(theURL.replace(window?.location?.pathname, cPath));
        } else {
            window?.location.assign(theURL.replace(window?.location?.pathname, "/web-Ui/user-panel/login/login.html"));
        }
    }, 1000);
}

function methodGET_II(Api) {
    const res = fetch(`${Api}`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: new Headers({
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + token,
        }),
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(response => {
        if (response?.ok) {
            return response.arrayBuffer(); // Parse the response data as JSON 
        } else {
            throw new Error('API request failed');
        }
    });
    return res;
}