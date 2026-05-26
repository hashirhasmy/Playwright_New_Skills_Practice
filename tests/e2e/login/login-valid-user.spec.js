import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.js';
import { USERS } from '../../data/users.data.js';

test('should login successfully with valid credentials', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page);

  // Act
  await loginPage.navigate();
  await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);

  // Assert
  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
});
