
const signInBtnLink = document.querySelector('.signInBtn-link');
const signUpBtnLink = document.querySelector('.signUpBtn-link');
const wrapper = document.querySelector('.wrapper');
signUpBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});
signInBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});

const loginIdBtn = document.getElementById('loginForm');
loginIdBtn.addEventListener('click', (e) => {
    const errorMessagesL = document.getElementById('errorMessagesL');
    errorMessagesL.innerHTML = '';

    const l_Email = document.getElementById('l_Email');
    const l_Password = document.getElementById('l_Password');

    // Validate email
    if (!validateEmail(l_Email?.value)) {
        errorMessagesL.innerHTML += 'Please enter a valid email address.';
        return;
    }

    // Validate password
    if (!validatePassword(l_Password?.value)) {
        errorMessagesL.innerHTML += 'Please enter a valid password.';
        return;
    }

    if (validateEmail(l_Email?.value) && validatePassword(l_Password?.value)) {
        req = {
            "email": l_Email?.value,
            "password": l_Password?.value
        };
        Url = 'http://localhost:1107/user/login';
        methodPOST(Url, req).then(res => {
            // Process the response res here 
            // Example: Logging the res to the console 
            if (res?.status === 'SUCCESS') {
                // console.log(res);
                isSetToken(res);
            }
        }).catch(error => {
            // Handle any errors here 
            console.error(error); // Example: Logging the error to the console 
            if (error?.status !== 'SUCCESS') {
                throw new Error('API request failed');
            }
        });
    }
});

const registerationIdBtn = document.getElementById('registeration');
registerationIdBtn.addEventListener('click', () => {
    let req = {};
    let Url = '';
    const errorMessagesR = document.getElementById('errorMessagesR');
    errorMessagesR.innerHTML = '';
    const r_Name = document.getElementById('r_Name');
    const r_Email = document.getElementById('r_Email');
    const r_Phone = document.getElementById('r_Phone');
    const r_Password = document.getElementById('r_Password');

    // Validate Name
    if (!validateName(r_Name?.value)) {
        errorMessagesR.innerHTML += 'Please enter a valid name.';
        return;
    }

    // Validate email
    if (!validateEmail(r_Email?.value)) {
        errorMessagesR.innerHTML += 'Please enter a valid email address.';
        return;
    }

    // Validate Phone
    if (!validatePhoneNumber(r_Phone?.value)) {
        errorMessagesR.innerHTML += 'Please enter a valid phone number.';
        return;
    }

    // Validate password
    if (!validatePassword(r_Password?.value)) {
        errorMessagesR.innerHTML += 'Please enter a valid password.';
        return;
    }

    if (validateName(r_Name?.value) && validateEmail(r_Email?.value) &&
        validatePhoneNumber(r_Phone?.value) && validatePassword(r_Password?.value)) {
        req = {
            "username": r_Name?.value,
            "phone": r_Phone?.value,
            "email": r_Email?.value,
            "password": r_Password?.value
        };
        Url = 'http://localhost:1107/user/register';
        methodPOST(Url, req).then(res => {
            // Process the response res here 
            // console.log(res); // Example: Logging the res to the console 
            if (res?.status === 'SUCCESS') {
                isSetToken(res);
            }
        }).catch(error => {
            // Handle any errors here 
            console.error(error); // Example: Logging the error to the console 
            if (error?.status !== 'SUCCESS') {
                throw new Error('API request failed');
            }
        });;
    }
});

function isSetToken(res) {
    localStorage.setItem('userToken', res?.token);
    localStorage.setItem('userData', JSON.stringify(res?.data));
    const theURL = window?.location?.href;
    window?.location.assign(theURL.replace("/web-Ui/user-panel/login/login.html", "/web-Ui/user-panel/landing-page/landing.html"));
}