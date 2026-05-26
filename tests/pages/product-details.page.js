export class ProductDetailsPage {
  constructor(page) {
    this.page = page;
    this.productName = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.removeButton = page.getByRole('button', { name: /remove/i });
    this.backButton = page.getByRole('button', { name: 'Back to products' });
  }

  async getProductName() {
    return await this.productName.textContent();
  }

  async getProductDescription() {
    return await this.productDescription.textContent();
  }

  async getProductPrice() {
    return await this.productPrice.textContent();
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }
}
