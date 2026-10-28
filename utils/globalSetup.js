// automationexercise.com has no shared demo account, so the test user is
// provisioned through the site's public API before the run (idempotent).
const { request } = require('@playwright/test');
const { testData } = require('./testData');

module.exports = async function globalSetup() {
  const { baseURL, user } = testData;
  const api = await request.newContext({ baseURL });

  try {
    const verify = await (await api.post('/api/verifyLogin', {
      form: { email: user.email, password: user.password },
    })).json();

    if (verify.responseCode === 200) return;

    const created = await (await api.post('/api/createAccount', {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: 'Mr',
        birth_date: '1',
        birth_month: '1',
        birth_year: '1995',
        firstname: 'GOQii',
        lastname: 'Tester',
        company: 'GOQii',
        address1: '1 Test Street',
        address2: '',
        country: 'India',
        zipcode: '400001',
        state: 'Maharashtra',
        city: 'Mumbai',
        mobile_number: '9999999999',
      },
    })).json();

    if (created.responseCode !== 201) {
      throw new Error(
        `Could not provision test user ${user.email}: ${JSON.stringify(created)}. ` +
        'If this email already exists with a different password, set TEST_USER_EMAIL / TEST_USER_PASSWORD in .env.'
      );
    }
  } finally {
    await api.dispose();
  }
};
