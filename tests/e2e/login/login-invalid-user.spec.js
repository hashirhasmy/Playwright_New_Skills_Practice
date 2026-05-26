import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.js';
import { USERS } from '../../data/users.data.js';

test('should fail login with invalid credentials', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page);

  // Act
  await loginPage.navigate();
  await loginPage.login(USERS.INVALID_USER.username, USERS.INVALID_USER.password);

  // Assert
  await expect(loginPage.errorMessage).toBeVisible();
  const errorText = await loginPage.getErrorMessage();
  expect(errorText).toContain('Username and password do not match');
});
