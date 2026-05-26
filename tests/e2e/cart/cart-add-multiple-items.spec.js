import { test, expect } from '../../fixtures/auth.fixture.js';
import { ProductsPage } from '../../pages/products.page.js';
import { CartPage } from '../../pages/cart.page.js';
import { PRODUCT_NAMES } from '../../data/users.data.js';

test('should add multiple items to cart', async ({ authenticatedPage }) => {
  // Arrange
  const productsPage = new ProductsPage(authenticatedPage);
  const cartPage = new CartPage(authenticatedPage);
  await authenticatedPage.goto('/inventory.html');

  // Act
  await productsPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
  await productsPage.addProductToCart(PRODUCT_NAMES.BIKE_LIGHT);
  await productsPage.addProductToCart(PRODUCT_NAMES.BOLT_TSHIRT);
  await productsPage.goToCart();

  // Assert
  const cartItemCount = await cartPage.getCartItemCount();
  expect(cartItemCount).toBe(3);
  const itemNames = await cartPage.getCartItemNames();
  expect(itemNames).toContain(PRODUCT_NAMES.BACKPACK);
  expect(itemNames).toContain(PRODUCT_NAMES.BIKE_LIGHT);
  expect(itemNames).toContain(PRODUCT_NAMES.BOLT_TSHIRT);
});
