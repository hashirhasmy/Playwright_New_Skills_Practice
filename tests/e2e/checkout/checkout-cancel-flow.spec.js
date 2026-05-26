import { test, expect } from '../../fixtures/auth.fixture.js';
import { ProductsPage } from '../../pages/products.page.js';
import { CartPage } from '../../pages/cart.page.js';
import { CheckoutStepOnePage } from '../../pages/checkout-step-one.page.js';
import { PRODUCT_NAMES } from '../../data/users.data.js';

test('should cancel checkout and return to cart', async ({ authenticatedPage }) => {
  // Arrange
  const productsPage = new ProductsPage(authenticatedPage);
  const cartPage = new CartPage(authenticatedPage);
  const checkoutStepOne = new CheckoutStepOnePage(authenticatedPage);

  await authenticatedPage.goto('/inventory.html');

  // Act
  await productsPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
  await productsPage.goToCart();
  await cartPage.proceedToCheckout();
  await checkoutStepOne.cancel();

  // Assert
  await expect(authenticatedPage).toHaveURL(/cart.html/);
  const cartItemCount = await cartPage.getCartItemCount();
  expect(cartItemCount).toBe(1);
});
