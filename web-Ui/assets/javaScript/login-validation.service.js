function validateName(name) {
    const minLength = 3;
    const hasCase = /[a-zA-Z]/.test(name);

    return (
        name.length >= minLength &&
        hasCase
    );
}

function validateEmail(email) {
    // Use a regular expression to check if the email is valid
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function validatePhoneNumber(input_str) {
    const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    return re.test(input_str);
}

function validatePassword(password) {
    // Customize these rules to match your password requirements
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber
    );
}