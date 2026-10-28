// Central, env-overridable test data. Override any value via .env or shell env vars.
require('dotenv').config();

const testData = {
  baseURL: process.env.BASE_URL || 'https://automationexercise.com',
  user: {
    name: process.env.TEST_USER_NAME || 'GOQii QA Demo',
    email: process.env.TEST_USER_EMAIL || 'goqii.qa.demo@example.com',
    password: process.env.TEST_USER_PASSWORD || 'GoqiiQa@123',
  },
  product: {
    searchTerm: process.env.SEARCH_PRODUCT || 'Blue Top',
    expectedQuantity: 1,
  },
};

module.exports = { testData };
