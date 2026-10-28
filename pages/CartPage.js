const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.deleteButtons = page.locator('.cart_quantity_delete');
    this.emptyCartMessage = page.locator('#empty_cart');
  }

  async goto() {
    await this.page.goto('/view_cart');
  }

  row(productName) {
    return this.cartRows.filter({
      has: this.page.locator('.cart_description h4 a').getByText(productName, { exact: true }),
    });
  }

  quantityOf(productName) {
    return this.row(productName).locator('.cart_quantity button');
  }

  /** The demo account is reused across runs, so start each run from an empty cart. */
  async clear() {
    await this.goto();
    let remaining = await this.deleteButtons.count();
    while (remaining > 0) {
      await this.deleteButtons.first().click();
      await expect(this.deleteButtons).toHaveCount(remaining - 1);
      remaining -= 1;
    }
  }
}

module.exports = { CartPage };
