import { test, expect } from '../../fixtures/auth.fixture.js';
import { ProductsPage } from '../../pages/products.page.js';
import { CartPage } from '../../pages/cart.page.js';
import { CheckoutStepOnePage } from '../../pages/checkout-step-one.page.js';
import { PRODUCT_NAMES } from '../../data/users.data.js';

test('should show validation error when first name is missing', async ({ authenticatedPage }) => {
  // Arrange
  const productsPage = new ProductsPage(authenticatedPage);
  const cartPage = new CartPage(authenticatedPage);
  const checkoutStepOne = new CheckoutStepOnePage(authenticatedPage);

  await authenticatedPage.goto('/inventory.html');

  // Act
  await productsPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
  await productsPage.goToCart();
  await cartPage.proceedToCheckout();
  await checkoutStepOne.fillCheckoutInfo('', 'Doe', '12345');
  await checkoutStepOne.continue();

  // Assert
  await expect(checkoutStepOne.errorMessage).toBeVisible();
  const errorText = await checkoutStepOne.getErrorMessage();
  expect(errorText).toContain('First Name is required');
});
