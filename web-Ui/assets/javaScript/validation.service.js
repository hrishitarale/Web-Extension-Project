
isCheckToken('/web-Ui/user-panel/landing-page/landing.html');

function isCheckToken(cPath) {
    const theURL = window?.location?.href;
    const token = localStorage.getItem('userToken');
    if (token !== null && token !== undefined && token !== '') {
        window?.location.assign(theURL.replace(window?.location?.pathname, cPath));
    } else {
        window?.location.assign(theURL.replace(window?.location?.pathname, "/web-Ui/user-panel/login/login.html"));
    }
}
