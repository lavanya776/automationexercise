const { test, expect } = require('../fixtures/baseTest');

test.describe('Login - negative cases', { tag: '@negative' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('wrong password shows an error and keeps the user logged out', async ({ page, loginPage, testData }) => {
    await loginPage.login(testData.user.email, 'WrongPassword!123');

    await expect(loginPage.errorMessage, 'Invalid-credentials error should be shown').toBeVisible();
    await expect(page, 'User should stay on the login page').toHaveURL(/\/login/);
    await expect(loginPage.logoutLink, 'Logout link must not appear').toHaveCount(0);
  });

  test('unregistered email shows an error and keeps the user logged out', async ({ page, loginPage }) => {
    await loginPage.login(`not.registered.${Date.now()}@example.com`, 'AnyPassword!123');

    await expect(loginPage.errorMessage, 'Invalid-credentials error should be shown').toBeVisible();
    await expect(page, 'User should stay on the login page').toHaveURL(/\/login/);
    await expect(loginPage.logoutLink, 'Logout link must not appear').toHaveCount(0);
  });

  test('empty email is blocked by required-field validation', async ({ page, loginPage }) => {
    await loginPage.login('', 'AnyPassword!123');

    const isValid = await loginPage.emailInput.evaluate((el) => el.checkValidity());
    expect(isValid, 'Empty email field should fail HTML5 validation').toBe(false);
    await expect(page, 'Form should not be submitted').toHaveURL(/\/login$/);
    await expect(loginPage.errorMessage, 'No server error, since nothing was submitted').toHaveCount(0);
  });
});

test.describe('Search - negative cases', { tag: '@negative' }, () => {
  test('search with no matching product shows no results', async ({ page, productsPage }) => {
    await productsPage.goto();
    await productsPage.search('zzqx-no-such-product');

    await expect(page).toHaveURL(/\/products\?search=zzqx-no-such-product/);
    await expect(productsPage.resultsHeading, 'Results section should still render').toBeVisible();
    await expect(productsPage.productCards, 'No product cards should be listed').toHaveCount(0);
  });
});
