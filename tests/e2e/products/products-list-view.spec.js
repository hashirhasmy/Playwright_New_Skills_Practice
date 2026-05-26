import { test, expect } from '../../fixtures/auth.fixture.js';
import { ProductsPage } from '../../pages/products.page.js';

test('should display all products on products page', async ({ authenticatedPage }) => {
  // Arrange
  const productsPage = new ProductsPage(authenticatedPage);
  await authenticatedPage.goto('/inventory.html');

  // Act
  const productCount = await productsPage.getProductCount();

  // Assert
  expect(productCount).toBe(6);
  await expect(productsPage.pageTitle).toHaveText('Products');
});
