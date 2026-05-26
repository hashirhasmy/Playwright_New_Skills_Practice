export class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getSubtotal() {
    const text = await this.subtotalLabel.textContent();
    return text.replace('Item total: $', '');
  }

  async getTax() {
    const text = await this.taxLabel.textContent();
    return text.replace('Tax: $', '');
  }

  async getTotal() {
    const text = await this.totalLabel.textContent();
    return text.replace('Total: $', '');
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
