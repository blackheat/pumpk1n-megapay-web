export const MAX_PRODUCTS_PER_PAGE = 8;
export const MAX_ORDERS_PER_PAGE = 8;
export const DEFAULT_ID = 0;
export const IMAGE_PATH = 'assets/pictures/img';
export const API_URL = `http://localhost:9090/api`;

// Guest

export const API_PRODUCT = `${API_URL}/products`;
export const API_TYPE = `${API_URL}/types`;
export const API_BRAND = `${API_URL}/brands`;
export const API_NEWEST_PRODUCTS = `${API_URL}/products/newest`;
export const API_REGISTER = `${API_URL}/auth/register`;
export const API_LOGIN = `${API_URL}/auth/login`;

// User
export const API_USER = `${API_URL}/user`;

export const API_GET_USER_INFO = `${API_USER}/account/getInfo`;
export const API_MODIFY_USER_INFO = `${API_USER}/account/modifyInfo`;
export const API_GET_USER_ORDERS = `${API_USER}/order/getOrders`;
export const API_ADD_USER_ORDERS = `${API_USER}/order/addOrder`;

export const EMAIL_PATTERN =  /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/g;
// dd-mm-yyyy
export const DATE_PATTERN = /^(((0[1-9]|[12][0-9]|3[01])[- \/.](0[13578]|1[02])|(0[1-9]|[12][0-9]|30)[- \/.](0[469]|11)|(0[1-9]|1\d|2[0-8])[- \/.]02)[- \/.]\d{4}|29[- \/.]02[- \/.](\d{2}(0[48]|[2468][048]|[13579][26])|([02468][048]|[1359][26])00))$/g;

export const convertDate = (date: any, type) => {
    if (!date || !date.day || !date.month || !date.year) {
        return null;
    }
    date.day = parseInt(date.day, 10) < 10 && date.day.toString()[0] !== '0' ? '0' + date.day : date.day;
    date.month = parseInt(date.month, 10) < 10 && date.month.toString()[0] !== '0' ? '0' + date.month : date.month;
    switch (type) {
        case 'ddMMyyyy':
        {
            return `${date.day}/${date.month}/${date.year}`;
        }
        case 'MMddyyyy':
        {
            return `${date.month}/${date.day}/${date.year}`;
        }
        case 'yyyyMMdd':
        {
            return `${date.year}/${date.month}/${date.day}`;
        }
        case 'yyyyddMM':
        {
            return `${date.year}/${date.day}/${date.month}`;
        }
        default:
        {
            return null;
        }
    }
};

// Employee

export const API_EMPLOYEE = `${API_URL}/employee`;

export const API_GET_EMPLOYEE_ORDERS = `${API_EMPLOYEE}/order/getOrders`;
export const API_MODIFY_EMPLOYEE_ORDERS = `${API_EMPLOYEE}/order/modifyOrder`;
