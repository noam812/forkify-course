//* Many real wolrd apps also have Helpers and configuration Modules
//*here we will put all the constant variable - We want the variables that are responsible for important Data
//* The data that we store here can be easily changed and affect our app - but it is here as a convention that no one should thouch it.
//! using all CAPS VAR  - is common for everyone to know that this is config var - andf not to be touched.

/**
 * Config module  is for @constant variables 
 * 
 */

export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';

export const TIMEOUT_SEC = 10;
export const RES_PER_PAGE = 10;
export const KEY = '8a526fdc-91da-495b-9777-2d15c91fe285'
export const MODAL_CLOSE_SEC = 2.5;