import { global } from '../pages/global';
import testsUsers from '../data/users.json';
import stripeCards from '../data/stripe-cc.json';
import { viewports } from '../support/viewports'

const okPassword = Cypress.env('USER_PASSWORD')

viewports.forEach(viewport => {

  describe(`Flatirons Hiring Tests ${viewport.device} [${viewport.size.join('x')}]`, () => {

    beforeEach(() => {
      cy.log("VIEWPORT:", ...viewport.size)
      cy.loadViewport(viewport)
    })

    it('Create user successfully', () => {
      cy.createUser();
    });

    it('Login new user', () => {
      cy.getLastRegisteredEmail().then(email => {
        cy.login(email, okPassword);
      })
    });

    it(`Upgrade user's plan`, () => {
      cy.getLastRegisteredEmail().then(email => {
        cy.login(email, okPassword);
        cy.upgradeUsersPlan(
          `${testsUsers.firstName} ${testsUsers.lastName}`,
          email,
          '1234567890',
          stripeCards.brand.visa,
          global.plans.professional
        );
      })
    });

    it('Login user via github', () => {
      cy.loginGithub('testUser', 'wrongPassword:)');
    });
  });

})