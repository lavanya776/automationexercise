// Central, env-overridable test data. Override any value via .env or shell env vars.
require('dotenv').config();

const testData = {
  baseURL: process.env.BASE_URL || 'https://automationexercise.com',
  // Login needs email + password; name is shown in the header after login.
  user: {
    name: process.env.TEST_USER_NAME || 'GOQii QA Demo',
    email: process.env.TEST_USER_EMAIL || 'goqii.qa.demo@example.com',
    password: process.env.TEST_USER_PASSWORD || 'GoqiiQa@123',
  },
  // Only the fields the sign-up form marks as required (also required by /api/createAccount).
  signupDetails: {
    firstname: 'GOQii',
    lastname: 'Tester',
    address1: '1 Test Street',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    zipcode: '400001',
    mobile_number: '9999999999',
  },
  product: {
    searchTerm: process.env.SEARCH_PRODUCT || 'Blue Top',
    expectedQuantity: 1,
  },
  invalid: {
    password: 'WrongPassword!123',
    noResultSearch: 'zzqx-no-such-product',
  },
};

module.exports = { testData };
