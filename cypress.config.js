const { defineConfig } = require("cypress");
const { parseBoolean } = require('./utils/booleans');
const { appendToDataFile } = require("./utils/files");
const { getURLConfirmation } = require('./utils/yopmail');
require('dotenv').config({})

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Flatirons-Hiring-Process',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    baseUrl: 'https://staging-fuse-aws.flatirons.com',
    screenshotOnRunFailure: true,
    env: {
      ENABLE_SCREENSHOTS: parseBoolean(process.env.ENABLE_SCREENSHOTS) || 0,
      USER_PASSWORD: process.env.USER_PASSWORD,
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task', {
        appendFileTask({ destinationPath, content }) {
          return Promise.resolve(appendToDataFile(destinationPath, content));
        },
        async getURLConfirmationTask(email) {
          return await getURLConfirmation(email)
        },
      });
    },
  },
});
