// Shared header navigation and ad blocking for every page object.
const AD_HOSTS = /googlesyndication|doubleclick|googleadservices|google-analytics|googletagmanager|adservice\.google|fundingchoicesmessages/;

class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = page.locator('#header');
    this.loggedInAs = this.header.getByText('Logged in as');
    this.signupLoginLink = this.header.getByRole('link', { name: 'Signup / Login' });
    this.logoutLink = this.header.getByRole('link', { name: 'Logout' });
    this.productsLink = this.header.getByRole('link', { name: 'Products' });
    this.cartLink = this.header.getByRole('link', { name: 'Cart' });
  }

  // Third-party ads (incl. full-screen vignettes) on this demo site intercept
  // clicks and make runs flaky, so they are blocked at the network level.
  static async blockAds(context) {
    await context.route(AD_HOSTS, (route) => route.abort());
  }

  async logout() {
    await this.logoutLink.click();
  }
}

module.exports = { BasePage };
