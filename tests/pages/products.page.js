export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.productItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async getProductCount() {
    return await this.productItems.count();
  }

  async getProductNames() {
    const names = await this.page.locator('.inventory_item_name').allTextContents();
    return names;
  }

  async addProductToCart(productName) {
    const product = this.page.locator('.inventory_item', { has: this.page.locator('.inventory_item_name', { hasText: productName }) });
    await product.getByRole('button', { name: /add to cart/i }).click();
  }

  async sortProducts(sortOption) {
    await this.sortDropdown.selectOption(sortOption);
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async getCartItemCount() {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    return parseInt(await this.cartBadge.textContent());
  }

  async clickProductName(productName) {
    await this.page.locator('.inventory_item_name', { hasText: productName }).click();
  }
}
