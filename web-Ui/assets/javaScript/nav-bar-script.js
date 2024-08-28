const list = document.querySelectorAll('.list');

function activeLink() {
    list.forEach((item) => {
        // console.log(item);
        item?.classList.remove('active')
    });
    this.classList.add('active');
}
list.forEach((item) => {
    item.addEventListener('click', activeLink)
});
isLocation();
function isLocation() {
    if (window?.location?.pathname === '/web-Ui/user-panel/dictionary/dictionary.html') {
        const dictionary_active = document.getElementById('dictionary_active');
        dictionary_active?.classList.add('active');
    } else if (window?.location?.pathname === '/web-Ui/user-panel/translator/translator.html') {
        const translator_active = document.getElementById('translator_active');
        translator_active?.classList.add('active');
    }
    else if (window?.location?.pathname === '/web-Ui/user-panel/landing-page/landing.html') {
        const welcome_active = document.getElementById('welcome_active');
        welcome_active?.classList.add('active');
    }
}

userName();
function userName() {
    const userData = localStorage.getItem('userData');
    if (userData !== null) {
        const data = JSON.parse(userData);
        const id = document.getElementById("welcomeUserName");
        if (id !== null && id !== undefined) {
            if (data?.name !== undefined && data?.name !== '') {
                id.innerText = `Welcome Back ${data?.name}`;
            } else {
                id.innerText = `Welcome to My Ext`;
            }
        }
    }
}