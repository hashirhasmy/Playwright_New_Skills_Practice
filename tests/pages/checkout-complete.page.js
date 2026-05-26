export class CheckoutCompletePage {
  constructor(page) {
    this.page = page;
    this.completeHeader = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async isOrderComplete() {
    return await this.completeHeader.isVisible();
  }

  async getConfirmationMessage() {
    return await this.completeHeader.textContent();
  }

  async goBackHome() {
    await this.backHomeButton.click();
  }
}
