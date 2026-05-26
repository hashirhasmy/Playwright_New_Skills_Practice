export class NavigationHelper {
  static async waitForPageLoad(page, url) {
    await page.waitForURL(url);
    await page.waitForLoadState('domcontentloaded');
  }

  static async verifyUrl(page, expectedPath) {
    return page.url().includes(expectedPath);
  }
}
