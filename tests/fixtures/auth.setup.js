import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { USERS } from '../data/users.data.js';

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);

  await page.waitForURL('**/inventory.html');

  // Save authentication state
  await page.context().storageState({ path: '.auth/standard-user.json' });
});
