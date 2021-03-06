export const MAX_PRODUCTS_PER_PAGE = 10;
export const MAX_PRODUCTS_ROW_PER_PAGE = 10;
export const MAX_ORDERS_PER_PAGE = 10;
export const MAX_ACCOUNTS_PER_PAGE = 10;
export const DEFAULT_ID = 0;
export const API_URL = `https://api.pumpk1n.xyz`;

// Normal User
export const API_GET_USER_INFO = `${API_URL}/account/info`;
export const API_PRODUCT = `${API_URL}/product`;
export const API_REGISTER = `${API_URL}/account/register`;
export const API_LOGIN = `${API_URL}/account/login`;
export const API_ORDER = `${API_URL}/order`;
export const API_CHECKOUT = `${API_ORDER}/checkout`;
// Internal User

export const API_SUPPLIER = `${API_URL}/supplier`;
export const API_INVENTORY = `${API_URL}/inventory`;
export const API_INVENTORY_IMPORT = `${API_INVENTORY}/imported`;
export const API_INVENTORY_EXPORT = `${API_INVENTORY}/exported`;
export const API_GET_ACCOUNT = `${API_URL}/account`;
export const API_INTERNAL_ACCOUNT = `${API_URL}/internal/account`;
export const API_BALANCE_SERVICE = `${API_URL}/token/balance`;
export const API_TOKEN_PURCHASE_REQUEST = `${API_URL}/token/transaction/request`;


// export const API_GET_USER_ORDERS = `${API_USER}/order/getOrders`;
// export const API_ADD_USER_ORDERS = `${API_USER}/order/addOrder`;;


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
