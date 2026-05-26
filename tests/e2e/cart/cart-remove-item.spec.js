import { test, expect } from '../../fixtures/auth.fixture.js';
import { ProductsPage } from '../../pages/products.page.js';
import { CartPage } from '../../pages/cart.page.js';
import { PRODUCT_NAMES } from '../../data/users.data.js';

test('should remove item from cart', async ({ authenticatedPage }) => {
  // Arrange
  const productsPage = new ProductsPage(authenticatedPage);
  const cartPage = new CartPage(authenticatedPage);
  await authenticatedPage.goto('/inventory.html');

  // Act - Add two items
  await productsPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
  await productsPage.addProductToCart(PRODUCT_NAMES.BIKE_LIGHT);
  await productsPage.goToCart();

  // Act - Remove one item
  await cartPage.removeItem(PRODUCT_NAMES.BACKPACK);

  // Assert
  const cartItemCount = await cartPage.getCartItemCount();
  expect(cartItemCount).toBe(1);
  const itemNames = await cartPage.getCartItemNames();
  expect(itemNames).not.toContain(PRODUCT_NAMES.BACKPACK);
  expect(itemNames).toContain(PRODUCT_NAMES.BIKE_LIGHT);
});
