import { test, expect } from '../../fixtures/auth.fixture.js';
import { ProductsPage } from '../../pages/products.page.js';
import { CartPage } from '../../pages/cart.page.js';
import { CheckoutStepOnePage } from '../../pages/checkout-step-one.page.js';
import { CheckoutStepTwoPage } from '../../pages/checkout-step-two.page.js';
import { CheckoutCompletePage } from '../../pages/checkout-complete.page.js';
import { TestDataHelper } from '../../helpers/test-data.helper.js';
import { PRODUCT_NAMES } from '../../data/users.data.js';

test('should complete full checkout flow successfully', async ({ authenticatedPage }) => {
  // Arrange
  const productsPage = new ProductsPage(authenticatedPage);
  const cartPage = new CartPage(authenticatedPage);
  const checkoutStepOne = new CheckoutStepOnePage(authenticatedPage);
  const checkoutStepTwo = new CheckoutStepTwoPage(authenticatedPage);
  const checkoutComplete = new CheckoutCompletePage(authenticatedPage);

  await authenticatedPage.goto('/inventory.html');

  // Act & Assert
  await test.step('Add product to cart', async () => {
    await productsPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
    await productsPage.goToCart();
  });

  await test.step('Proceed to checkout', async () => {
    await cartPage.proceedToCheckout();
  });

  await test.step('Fill checkout information', async () => {
    const info = TestDataHelper.generateCheckoutInfo();
    await checkoutStepOne.fillCheckoutInfo(info.firstName, info.lastName, info.postalCode);
    await checkoutStepOne.continue();
  });

  await test.step('Complete purchase', async () => {
    await checkoutStepTwo.finish();
  });

  await expect(checkoutComplete.completeHeader).toHaveText('Thank you for your order!');
  await expect(authenticatedPage).toHaveURL(/checkout-complete.html/);
});
