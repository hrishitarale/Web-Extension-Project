checkToken();
function checkToken() {
    const theURL = window?.location?.href;
    const token = localStorage.getItem('adminToken');
    if (token !== null && token !== undefined){
        window?.location.assign(theURL.replace(window?.location?.pathname, "/web-Ui/admin-panel/dashboard/dashboard.html"));
    }
}

const adminLoginForm = document.getElementById('adminLoginForm');
adminLoginForm.addEventListener('click', (e) => {
    const errorMessagesA = document.getElementById('errorMessagesA');
    errorMessagesA.innerHTML = '';

    const admin_Email = document.getElementById('admin_Email');
    const admin_Password = document.getElementById('admin_Password');

    // Validate email
    if (!validateEmail(admin_Email?.value)) {
        errorMessagesA.innerHTML += 'Please enter a valid email address.';
        return;
    }

    // Validate password
    if (!validatePassword(admin_Password?.value)) {
        errorMessagesA.innerHTML += 'Please enter a valid password.';
        return;
    }

    if (validateEmail(admin_Email?.value) && validatePassword(admin_Password?.value)) {
        req = {
            "email": admin_Email?.value,
            "password": admin_Password?.value
        };
        Url = 'http://localhost:1107/admin/login';
        methodPOST(Url, req).then(res => {
            // Process the response res here 
            // Example: Logging the res to the console 
            if (res?.status === 'SUCCESS') {
                // console.log(res);
                localStorage.setItem('adminToken', res?.token);
                localStorage.setItem('adminData', JSON.stringify(res?.data));
                const theURL = window?.location.href;
                window?.location.assign(theURL.replace("/web-Ui/admin-panel/admin-login/login.html", "/web-Ui/admin-panel/dashboard/dashboard.html"));
            }
        }).catch(error => {
            // Handle any errors here 
            console.error(error); // Example: Logging the error to the console 
            if (error?.status !== 'SUCCESS') {
                alert(error?.message);
            }
        });
    }
});
