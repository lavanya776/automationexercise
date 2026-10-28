// Custom fixtures: page objects are injected into tests, and ads are blocked
// automatically for every test, so specs contain only test logic.
const base = require('@playwright/test');
const { BasePage } = require('../pages/BasePage');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');
const { testData } = require('../utils/testData');

const test = base.test.extend({
  blockAds: [
    async ({ context }, use) => {
      await BasePage.blockAds(context);
      await use();
    },
    { auto: true },
  ],

  testData: async ({}, use) => {
    await use(testData);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

module.exports = { test, expect: base.expect };
