# GOQii QA Assessment – Task 3: UI Automation (Playwright + JavaScript)

UI automation for **https://automationexercise.com**. It uses Playwright Test, the Page Object Model and custom fixtures. There is one end-to-end test for the happy path and four negative tests.

## Happy path: `tests/checkout-flow.spec.js`

The brief asks for a single end-to-end flow, so this is one test. Each step is a `test.step` with its own assertions, so the HTML report names the exact step that failed.

| # | Step | Key assertions |
|---|------|----------------|
| 1 | Log in with valid credentials | "Logged in as &lt;name&gt;" and the **Logout** link are shown |
| – | Precondition: empty the cart | "Cart is empty!" is visible (the demo account is reused between runs) |
| 2 | Search for the product with the site's search box | URL contains `?search=`; the **Searched Products** heading is shown |
| 3 | Check the expected product is shown | Exactly one card is named `Blue Top` |
| 4 | Add the product to the cart | The **Added!** modal is visible and shows its confirmation text |
| 5 | Open the cart and check it | URL is `/view_cart`; there is 1 line item, the product name matches, and quantity = `1` |
| 6 | Log out | Click **Logout** in the header |
| 7 | Check the logged-out state | Redirected to `/login`; the login form and **Signup / Login** link are back; Logout and "Logged in as" are gone |

## Negative cases: `tests/negative.spec.js`

| Test | Assertions |
|------|------------|
| Wrong password | "Your email or password is incorrect!" is shown; the user stays on `/login`; no Logout link |
| Unregistered email | Same error; the user stays logged out |
| Empty email field | The browser's required-field validation blocks the form (`checkValidity()` is false); nothing is submitted |
| Search with no matches | The results section renders with 0 product cards |

## Fixtures: `fixtures/baseTest.js`

The specs import `test` and `expect` from `fixtures/baseTest.js` instead of `@playwright/test`. This file extends Playwright's `test` with:

- `loginPage`, `productsPage`, `cartPage`: page objects injected into each test
- `testData`: the configurable test data
- `blockAds`: an **auto** fixture that blocks ad domains for every test, so no spec has to remember to do it

## Project structure

```
goqii-playwright-automation/
├── pages/
│   ├── BasePage.js        # shared header locators (logout, login link), ad blocking
│   ├── LoginPage.js       # login form
│   ├── ProductsPage.js    # search, product cards, add to cart, "Added!" modal
│   └── CartPage.js        # cart rows, quantity, clearing the cart
├── fixtures/
│   └── baseTest.js        # page-object, test-data and auto ad-blocking fixtures
├── tests/
│   ├── checkout-flow.spec.js   # end-to-end happy path
│   └── negative.spec.js        # invalid login, empty field, no-result search
├── utils/
│   ├── testData.js        # configurable test data (env / .env overrides)
│   └── globalSetup.js     # creates the demo user through the site's API if it does not exist
├── playwright.config.js
├── package.json
├── .env.example
└── README.md
```

## Prerequisites

- Node.js 18 or later (developed on Node 24.11.1)
- npm
- Internet access to automationexercise.com

## Setup

```bash
cd goqii-playwright-automation
npm install
npm run install:browsers      # = npx playwright install chromium
```

Optional: to override the test data, copy the env template and edit it:

```bash
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
```

## Run the tests

| Command | What it does |
|---------|--------------|
| `npm test` | Runs all tests (5) in Chromium with a visible browser |
| `npm run test:e2e` | Runs only the end-to-end happy path (`--grep @e2e`) |
| `npm run test:negative` | Runs only the negative tests (`--grep @negative`) |
| `npm run test:debug` | Runs in the Playwright Inspector |
| `npm run report` | Opens the latest HTML report |

Tests are tagged with Playwright's `tag` option (`@e2e`, `@negative`). You can also filter directly:

```bash
npx playwright test --grep @negative                 # only negative tests
npx playwright test --grep-invert @negative          # everything except negative tests
npx playwright test --grep "wrong password"          # a single test, matched by title
```

## Reports and artifacts

- **HTML report:** `playwright-report/index.html`. Open it with `npm run report`.
- **Failure artifacts:** saved to `test-results/<test-name>/`.
  - `test-failed-1.png` is a screenshot taken automatically on failure (`screenshot: 'only-on-failure'`).
  - `video.webm` and `trace.zip` are also kept on failure. Open a trace with `npx playwright show-trace <path>/trace.zip`.
  - All of these are attached to the failed test in the HTML report.

## Test data and credentials

All values live in `utils/testData.js`. You can override each one with an environment variable or a `.env` file:

| Variable | Default |
|----------|---------|
| `BASE_URL` | `https://automationexercise.com` |
| `TEST_USER_NAME` | `GOQii QA Demo` |
| `TEST_USER_EMAIL` | `goqii.qa.demo@example.com` |
| `TEST_USER_PASSWORD` | `GoqiiQa@123` |
| `SEARCH_PRODUCT` | `Blue Top` |

The browser runs **headed** (visible) by default, set by `headless: false` in `playwright.config.js`. To run headless, change it to `true`.

## Website notes and limitations

- **No shared demo account.** automationexercise.com has no published demo login. Before the run, `utils/globalSetup.js` calls the site's public API (`POST /api/verifyLogin`, then `POST /api/createAccount` if needed) so the user above exists. This means the project runs from a clean setup with no manual sign-up. If someone else has registered the default email with a different password, set your own `TEST_USER_EMAIL` and `TEST_USER_PASSWORD`.
- **The cart persists for the account.** Items stay in the account's cart between runs, so the test empties the cart first. This keeps the "quantity = 1" check reliable.
- **Ads are blocked.** The site loads Google ads, including full-screen vignettes, that can block clicks. Ad and analytics domains are blocked at the network level in `BasePage.blockAds`. This does not affect any feature under test.
- **Search reloads the page with JavaScript.** `ProductsPage.search()` waits for the results page `load` event so the site's add-to-cart handlers are attached before the test clicks.
- **Serial runs only.** All runs share one account, so `workers: 1` is set.
- **Public demo site.** The site sometimes returns a "This website is under heavy load (queue full)" page. I saw this during development. So `retries: 1` is set, and a test that passes only on retry is marked **flaky** in the report instead of being hidden. If the site is down or changes its markup, tests can still fail for reasons outside this project.
- **Saucedemo was not used.** It has no product search, so it cannot cover the required flow.
- **No fixed waits.** The test relies on Playwright's auto-waiting and web-first assertions, with no `waitForTimeout`.
