import { test, expect } from '../../fixtures/auth.fixture.js';
import { ProductsPage } from '../../pages/products.page.js';
import { SORT_OPTIONS } from '../../data/users.data.js';

test('should sort products by price high to low', async ({ authenticatedPage }) => {
  // Arrange
  const productsPage = new ProductsPage(authenticatedPage);
  await authenticatedPage.goto('/inventory.html');

  // Act
  await productsPage.sortProducts(SORT_OPTIONS.PRICE_HIGH_LOW);

  // Get all product prices
  const prices = await authenticatedPage.locator('.inventory_item_price').allTextContents();
  const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));

  // Assert
  const sortedPricesDesc = [...numericPrices].sort((a, b) => b - a);
  expect(numericPrices).toEqual(sortedPricesDesc);
});
