const { test, expect } = require('./baseTest');

test('user can log in, search a product, add it to cart, verify cart and log out', { tag: '@e2e' }, async ({
  page, loginPage, productsPage, cartPage, testData,
}) => {
  const { user, product } = testData;

  await test.step('Log in with valid credentials', async () => {
    await loginPage.goto();
    await expect(loginPage.loginHeading, 'Login form should be visible').toBeVisible();
    await loginPage.login(user.email, user.password);
    await expect(loginPage.loggedInAs, 'Header should show the logged-in user').toContainText(user.name);
    await expect(loginPage.logoutLink, 'Logout link should appear after login').toBeVisible();
  });

  await test.step('Precondition: empty cart (shared demo account)', async () => {
    await cartPage.clear();
    await expect(cartPage.emptyCartMessage, 'Cart should be empty before the test').toBeVisible();
  });

  await test.step(`Search for "${product.searchTerm}"`, async () => {
    await productsPage.goto();
    await productsPage.search(product.searchTerm);
    await expect(page, 'URL should carry the search query').toHaveURL(/\/products\?search=/);
    await expect(productsPage.resultsHeading, 'Search results heading should be shown').toBeVisible();
  });

  await test.step('Verify the expected product is displayed', async () => {
    await expect(
      productsPage.productCard(product.searchTerm),
      `Exactly one "${product.searchTerm}" card should be in the search results`
    ).toHaveCount(1);
    await expect(productsPage.productCard(product.searchTerm)).toBeVisible();
  });

  await test.step('Add the product to the cart', async () => {
    await productsPage.addToCart(product.searchTerm);
    await expect(productsPage.addedModal, '"Added!" confirmation modal should appear').toBeVisible();
    await expect(productsPage.addedModal).toContainText('Your product has been added to cart.');
  });

  await test.step('Open the cart and verify product and quantity', async () => {
    await productsPage.openCartFromModal();
    await expect(page, 'Should navigate to the cart page').toHaveURL(/\/view_cart/);
    await expect(cartPage.cartRows, 'Cart should contain exactly one line item').toHaveCount(1);
    await expect(cartPage.row(product.searchTerm), `Cart should contain "${product.searchTerm}"`).toBeVisible();
    await expect(cartPage.quantityOf(product.searchTerm), 'Quantity should match')
      .toHaveText(String(product.expectedQuantity));
  });

  await test.step('Log out', async () => {
    await cartPage.logout();
  });

  await test.step('Verify logged-out state', async () => {
    await expect(page, 'Logout should redirect to the login page').toHaveURL(/\/login/);
    await expect(loginPage.loginHeading, 'Login form should be visible again').toBeVisible();
    await expect(loginPage.signupLoginLink, '"Signup / Login" link should be back in the header').toBeVisible();
    await expect(loginPage.logoutLink, 'Logout link should no longer be present').toHaveCount(0);
    await expect(loginPage.loggedInAs, '"Logged in as" should no longer be present').toHaveCount(0);
  });
});
