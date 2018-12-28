import { EMAIL_PATTERN, DATE_PATTERN } from '../constants';


export const isValidDate = (date) => {
    if (!date) {
        return false;
    }
    const regExp = new RegExp(DATE_PATTERN);
    if (!regExp.test(date)) {
        return false;
    }
    return true;
};

export const isValidEmail = (email) => {
    if (!email) {
        return false;
    }
    const regExp = new RegExp(EMAIL_PATTERN);
    if (!regExp.test(email)) {
        return false;
    }
    return true;
};