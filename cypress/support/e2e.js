// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import { getStringWithHyphens } from '../../utils/strings';
import 'cypress-mochawesome-reporter/register';

// Alternatively you can use CommonJS syntax:
// require('./commands')

let TEST_ID = 1

beforeEach(() => {
  let testId = TEST_ID++
  const suiteName = getStringWithHyphens(Cypress.mocha.getRunner().test?.parent?.title) || "root";
  const testName = getStringWithHyphens(Cypress.mocha.getRunner().test?.title) || "unknown";

  Cypress.env('CURRENT_TEST_PATH', `${suiteName}/${testId}-${testName}`);

  cy.log(`Current test path: ${Cypress.env('CURRENT_TEST_PATH')}`);

});
