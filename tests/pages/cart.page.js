export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.removeButtons = page.locator('[data-test^="remove-"]');
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getCartItemNames() {
    const names = await this.page.locator('.inventory_item_name').allTextContents();
    return names;
  }

  async removeItem(productName) {
    const product = this.page.locator('.cart_item', { has: this.page.locator('.inventory_item_name', { hasText: productName }) });
    await product.locator('[data-test^="remove-"]').click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async isCartEmpty() {
    const count = await this.getCartItemCount();
    return count === 0;
  }
}
