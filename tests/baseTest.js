// Base test for all specs: provisions the demo user, blocks ads and injects
// page objects and test data, so specs contain only test logic.
const base = require('@playwright/test');
const { BasePage } = require('../pages/BasePage');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');
const { testData } = require('../utils/testData');

const test = base.test.extend({
  // automationexercise.com has no shared demo account, so the test user is
  // created through the site's public API once per worker (idempotent).
  ensureTestUser: [
    async ({ playwright }, use) => {
      const { baseURL, user, signupDetails } = testData;
      const api = await playwright.request.newContext({ baseURL });

      const verify = await (await api.post('/api/verifyLogin', {
        form: { email: user.email, password: user.password },
      })).json();

      if (verify.responseCode !== 200) {
        const created = await (await api.post('/api/createAccount', {
          form: { name: user.name, email: user.email, password: user.password, ...signupDetails },
        })).json();

        if (created.responseCode !== 201) {
          await api.dispose();
          throw new Error(
            `Could not provision test user ${user.email}: ${JSON.stringify(created)}. ` +
            'If this email already exists with a different password, set TEST_USER_EMAIL / TEST_USER_PASSWORD in .env.'
          );
        }
      }

      await api.dispose();
      await use();
    },
    { scope: 'worker', auto: true },
  ],

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
