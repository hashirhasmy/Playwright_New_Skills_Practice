export class TestDataHelper {
  static generateCheckoutInfo() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345'
    };
  }

  static getRandomProduct(products) {
    return products[Math.floor(Math.random() * products.length)];
  }

  static generateUniqueEmail() {
    return `test_${Date.now()}@example.com`;
  }
}
