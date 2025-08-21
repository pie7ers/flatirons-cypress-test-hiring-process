// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { routes } from './routes'
import { signIn } from '../pages/signIn';
import { signUp } from '../pages/signUp';
import { global } from '../pages/global';
import { importers } from '../pages/importers';
import { menu } from '../pages/menu';
import { emailConfirmed } from '../pages/emailConfirmed';
import { billingAndPlans } from '../pages/billingAndPlans';
import { githubLogin } from '../pages/github/login';
import { getRandomEmail, getValueTime } from '../../utils/commons'
import testsUsers from '../data/users.json';
import stripeCards from '../data/stripe-cc.json';
import 'cypress-iframe';
import 'cypress-real-events';

const okPassword = Cypress.env('USER_PASSWORD');
const defaultUserOK = 'flatirons-test1@yopmail.com';
const newUsersFile = 'cypress/data/users-created.json';
const limitDesktopWidth = 600;

Cypress.Commands.add('loadViewport', (viewport) => {
    cy.viewport(...viewport.size);
    cy.wrap(viewport.size.join('x')).as('currentViewport');
    cy.wrap(viewport.size[0]).as('currentViewportWidth');
})

Cypress.Commands.add('fullScreenshot', (complement) => {
  if (!Cypress.env('ENABLE_SCREENSHOTS')) return;
  cy.get('@currentViewport').then((viewport) => {
    complement = complement ? `-${complement.split(' ').join('-')}` : ''
    const testsPath = Cypress.env('CURRENT_TEST_PATH') || 'default';
    cy.screenshot(`${testsPath}${complement}-${viewport}`, { capture: 'fullPage' });
  });
})

Cypress.Commands.add('createUser', () => {
  const email = getRandomEmail();
  cy.visit(routes.home);
  cy.appendFileTask(newUsersFile, {
    email,
    firstName: testsUsers.firstName,
    lastName: testsUsers.lastName,
  });

  cy.get(signIn.signUpLink).click();
  cy.get(signUp.firstNameBox).type(testsUsers.firstName);
  cy.get(signUp.lastNameBox).type(testsUsers.lastName);
  cy.get(signUp.companyNameBox).type(testsUsers.companyName);
  cy.get(signUp.emailAddressBox).type(email);
  cy.get(signUp.passwordBox).type(okPassword);
  cy.fullScreenshot('all data entered');
  cy.get(signUp.signUpButton).click();
  cy.visitUrlConfirmation(email)

  cy.get(emailConfirmed.title).should('be.visible').and('have.text', emailConfirmed.titleContent)
  cy.get(emailConfirmed.body).should('be.visible').and('have.text', emailConfirmed.bodyContent)
  cy.get(emailConfirmed.signInButton).should('be.visible').and('have.text', global.sigiInText)
  cy.fullScreenshot('email confirmed');
  cy.get(emailConfirmed.signInButton).click()
})

Cypress.Commands.add('getURLConfirmation', (email) => {
  return cy.task('getURLConfirmationTask', email)
})

Cypress.Commands.add('appendFileTask', (destinationPath, content) => {
  return cy.task('appendFileTask', {
    destinationPath,
    content,
  });
})

Cypress.Commands.add('visitUrlConfirmation', (email) => {
  cy.wait(3000)
  cy.getURLConfirmation(email).as('urlConfirmation');
  cy.get('@urlConfirmation').then(url => {
    cy.log('URL CONFIRMATION:', url)
    cy.visit(url);
  });
})

Cypress.Commands.add('getElementByViewportWidth', (desktopSelector, responsiveSelector) => {
  return cy.get('@currentViewportWidth').then((viewportWidth) => {
    const selector = Number(viewportWidth) >= limitDesktopWidth ? desktopSelector : responsiveSelector;
    return cy.get(selector);
  });
})

Cypress.Commands.add('clickElementByViewporWidth', (responsiveSelector) => {
  cy.get('@currentViewportWidth').then((viewportWidth) => {
    if (Number(viewportWidth) < limitDesktopWidth)
      cy.get(responsiveSelector).click();
  });
})

Cypress.Commands.add('login', (email, password) => {
  cy.visit(routes.home);
  cy.get(signIn.emailBox).type(email);
  cy.get(signIn.passwordBox).type(password);
  cy.fullScreenshot('credentials entered');
  cy.get(signIn.signInButton).click();
  cy.url().should('include', routes.accountImporters);
  cy.get(importers.createAnImporterTitle).should('be.visible').and('have.text', importers.createAnImporterTitleText)
  cy.get(importers.createAnImporterSubTitle).should('be.visible')
    .and('have.text', importers.createAnImporterSubTitleText)
  cy.get(importers.createAnImporterBody).should('be.visible').and('have.text', importers.createAnImporterBodyText)
  cy.get(importers.createAnImporterButton).should('be.visible')
  cy.getElementByViewportWidth(menu.menu.desktop, menu.menu.responsive).should('be.visible')
  cy.fullScreenshot('logged in');
})

Cypress.Commands.add('loginGithub', (user, password) => {
  cy.visit(routes.home)
  cy.get(signIn.signInGithubButton).click()
  cy.origin('https://github.com', { args: { githubLogin, user, password } }, ({ githubLogin, user, password }) => {
    cy.get(githubLogin.userBox).type(user);
    cy.get(githubLogin.passwordBox).type(password);
    cy.get(githubLogin.signInButton).click();
    cy.screenshot('github/login/wrong-login', { capture: 'fullPage' });
  })
})

Cypress.Commands.add('getLastRegisteredEmail', () => {
  cy.readFile(newUsersFile).then(users => {
    let data = users;
    data = Array.isArray(users) ? data : [];
    const lastElement = data.at(-1)
    if (!lastElement || !lastElement?.hasOwnProperty('email')) return defaultUserOK
    return lastElement.email
  })
})

Cypress.Commands.add('upgradeUsersPlan', (cardHolder, email, phoneNumber, cardNumber, planName) => {
  cy.clickElementByViewporWidth(menu.menu.responsive)
  cy.getElementByViewportWidth(menu.accountMenu.desktop, menu.accountMenu.responsive).click();
  cy.fullScreenshot('account menu');
  cy.get(menu.billingAndPlans).click();
  cy.url().should('include', routes.billingAndPlans);
  cy.fullScreenshot('billing and plans');
  if (planName == global.plans.professional) {
    cy.get(billingAndPlans.professionalPlanButton).scrollIntoView().click();
  }
  cy.fillStripePayment(cardHolder, email, phoneNumber, cardNumber);
  cy.validatePurchasedPlan(planName, cardHolder, cardNumber)
})

Cypress.Commands.add('fillStripePayment', (cardHolder, email, phoneNumber, cardNumber) => {
  cy.get(billingAndPlans.form.cardHolderBox).type(cardHolder);
  cy.get(billingAndPlans.form.emailBox).type(email);
  cy.get(billingAndPlans.form.phoneNumberBox).type(phoneNumber);
  cy.get(billingAndPlans.form.iframe)
    .realClick()
    .realType(cardNumber)
    .realType(stripeCards.default.expirationDate).realType(stripeCards.default.cvc)
  cy.fullScreenshot('billing data filled')
  cy.get(billingAndPlans.form.upgradePlanButton).click();
})

Cypress.Commands.add('validatePurchasedPlan', (planName, cardHolder, cardNumber) => {
  const valueTimePlanLabel = getValueTime(planName)
  const lastFourCCNumbersLabel = cardNumber.slice(cardNumber.length - 4)
  const invoiceNumberRegex = /[A-Z0-9]{8}-\d{4}/
  cy.url().should('include', routes.billingAndPlans);
  cy.wait(10000);
  cy.reload();
  cy.get(billingAndPlans.selectedPlanLable).should('have.text', planName)
  cy.validateCleanString(billingAndPlans.valueTimePlanLabel, valueTimePlanLabel)
  cy.get(billingAndPlans.cardHolderLable).should('have.text', cardHolder)
  cy.validateCleanString(billingAndPlans.lastFourCCNumbersLabel, lastFourCCNumbersLabel)
  cy.get(billingAndPlans.addedCardLink).scrollIntoView().should('be.visible')
  cy.get(billingAndPlans.invoicesTable).should('be.visible')
  cy.validateMatch(billingAndPlans.invoiceNumber, invoiceNumberRegex)
  cy.get(billingAndPlans.invoiceStatus).first().should('have.text', 'paid')
  cy.get(billingAndPlans.professionalPlanButton).should('have.attr', 'disabled')
  cy.get(billingAndPlans.professionalPlanButton).scrollIntoView().should('be.visible')
  cy.fullScreenshot('validate purchased plan');
})

Cypress.Commands.add('validateCleanString', (selector, expectedValue) => {
  cy.get(selector).invoke('text').then(text => {
    const cleanedText = text.trim()
    expect(cleanedText).to.eq(expectedValue)
  })
})

Cypress.Commands.add('validateMatch', (selector, expectedRegex) => {
  cy.get(selector).invoke('text').then(text => {
    const cleanedText = text.trim()
    expect(cleanedText).to.match(expectedRegex)
  })
})