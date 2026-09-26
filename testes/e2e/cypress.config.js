module.exports = {
  fixturesFolder: false,
  chromeWebSecurity: false,

  e2e: {
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: false,

    setupNodeEvents(on, config) {
      return config;
    }
  }
};
