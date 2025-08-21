declare namespace Cypress {
  interface Chainable {
    loadViewport(viewport: Record<any, any>): void;
    fullScreenshot(complement: string): Chainable;
    createUser(): void;
    login(email?: string, password?: string): void;
    loginGithub(user: string, password: string): void;
    getURLConfirmation(email: string): void;
    appendFileTask(destinationPath: string, content: any): void;
    visitUrlConfirmation(email: string): void;
    getElementByViewportWidth(desktopSelector: string, responsiveSelector: string): Chainable;
    clickElementByViewporWidth(responsiveSelector: string): Chainable;
    getLastRegisteredEmail(): Chainable;
    upgradeUsersPlan(
      cardHolder: string,
      email: string,
      phoneNumber: string,
      cardNumber: string,
      planName: string,
    ): Chainable;
    fillStripePayment(
      cardHolder: string,
      email: string,
      phoneNumber: string,
      cardNumber?: string,
    ): Chainable;
    validatePurchasedPlan(
      planName: string,
      cardHolder: string,
      cardNumber: string,
    ): Chainable;
  }
}