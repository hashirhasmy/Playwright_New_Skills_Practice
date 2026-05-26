import { chromium } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { USERS } from '../data/users.data.js';

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: 'https://www.saucedemo.com'
  });
  const page = await context.newPage();

  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);

  await page.waitForURL('**/inventory.html');

  await context.storageState({ path: '.auth/standard-user.json' });

  await browser.close();
}

export default globalSetup;
