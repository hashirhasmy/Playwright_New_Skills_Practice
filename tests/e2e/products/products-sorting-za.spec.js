import { test, expect } from '../../fixtures/auth.fixture.js';
import { ProductsPage } from '../../pages/products.page.js';
import { SORT_OPTIONS } from '../../data/users.data.js';

test('should sort products by name descending (Z to A)', async ({ authenticatedPage }) => {
  // Arrange
  const productsPage = new ProductsPage(authenticatedPage);
  await authenticatedPage.goto('/inventory.html');

  // Act
  await productsPage.sortProducts(SORT_OPTIONS.NAME_DESC);
  const productNames = await productsPage.getProductNames();

  // Assert
  const sortedNamesDesc = [...productNames].sort().reverse();
  expect(productNames).toEqual(sortedNamesDesc);
});
