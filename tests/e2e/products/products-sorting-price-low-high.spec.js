import { test, expect } from '../../fixtures/auth.fixture.js';
import { ProductsPage } from '../../pages/products.page.js';
import { SORT_OPTIONS } from '../../data/users.data.js';

test('should sort products by price low to high', async ({ authenticatedPage }) => {
  // Arrange
  const productsPage = new ProductsPage(authenticatedPage);
  await authenticatedPage.goto('/inventory.html');

  // Act
  await productsPage.sortProducts(SORT_OPTIONS.PRICE_LOW_HIGH);

  // Get all product prices
  const prices = await authenticatedPage.locator('.inventory_item_price').allTextContents();
  const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));

  // Assert
  const sortedPrices = [...numericPrices].sort((a, b) => a - b);
  expect(numericPrices).toEqual(sortedPrices);
});
