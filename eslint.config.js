const js = require("@eslint/js");
const cypress = require("eslint-plugin-cypress");


module.exports = [
  {
    ignores: ["node_modules/**", "cypress/screenshots/**", "cypress/videos/**"],
  },
  js.configs.recommended,
  {
    files: ["cypress/**/*.js", "utils/**/*.js"],
    plugins: {
      cypress,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        cy: "readonly",
        Cypress: "readonly",
        expect: "readonly",
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        beforeEach: "readonly",
        after: "readonly",
        afterEach: "readonly",
        context: "readonly",
        specify: "readonly",
        module: "readonly",
        require: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "no-prototype-builtins": "off",
      "max-lines-per-function": ["warn", 50],
      "max-len": ["warn", { code: 150 }],
      "no-unused-vars": "warn",
    },
  },
];
