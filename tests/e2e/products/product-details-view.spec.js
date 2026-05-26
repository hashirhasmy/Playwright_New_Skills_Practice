import { test, expect } from '../../fixtures/auth.fixture.js';
import { ProductsPage } from '../../pages/products.page.js';
import { ProductDetailsPage } from '../../pages/product-details.page.js';
import { PRODUCT_NAMES } from '../../data/users.data.js';

test('should view individual product details', async ({ authenticatedPage }) => {
  // Arrange
  const productsPage = new ProductsPage(authenticatedPage);
  const productDetailsPage = new ProductDetailsPage(authenticatedPage);
  await authenticatedPage.goto('/inventory.html');

  // Act
  await productsPage.clickProductName(PRODUCT_NAMES.BACKPACK);

  // Assert
  await expect(authenticatedPage).toHaveURL(/inventory-item.html/);
  await expect(productDetailsPage.productName).toHaveText(PRODUCT_NAMES.BACKPACK);
  await expect(productDetailsPage.productPrice).toBeVisible();
  await expect(productDetailsPage.productDescription).toBeVisible();
});
