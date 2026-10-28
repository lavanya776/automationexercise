// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { testData } = require('./utils/testData');

module.exports = defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./utils/globalSetup'),
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1, // one shared demo account -> run serially
  // The public demo site intermittently serves a "heavy load (queue full)" page.
  // One retry absorbs that; such tests are reported as "flaky", not hidden.
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  outputDir: 'test-results',
  use: {
    baseURL: testData.baseURL,
    headless: false,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
