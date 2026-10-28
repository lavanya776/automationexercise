const { BasePage } = require('./BasePage');

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.resultsHeading = page.getByRole('heading', { name: 'Searched Products' });
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.addedModal = page.locator('#cartModal');
    this.viewCartLink = this.addedModal.getByRole('link', { name: 'View Cart' });
  }

  async goto() {
    await this.page.goto('/products');
  }

  async search(term) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    // The search button redirects via JS; wait for the full 'load' so the
    // site's add-to-cart handlers (cart.js) are bound before we interact.
    await this.page.waitForURL(/\/products\?search=/, { waitUntil: 'load' });
  }

  /** Product card whose visible name exactly matches `name`. */
  productCard(name) {
    return this.productCards.filter({
      has: this.page.locator('.productinfo p').getByText(name, { exact: true }),
    });
  }

  async addToCart(name) {
    await this.productCard(name).locator('.productinfo .add-to-cart').click();
  }

  async openCartFromModal() {
    await this.viewCartLink.click();
  }
}

module.exports = { ProductsPage };
