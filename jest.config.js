module.exports = {
  globalSetup: "<rootDir>/jest.setup.js",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^~/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.js?$": "babel-jest",
    "^.+\\.ts?$": "ts-jest",
    ".*\\.(vue)$": "vue-jest",
  },
  moduleFileExtensions: ["ts", "js", "vue", "json"],

  collectCoverageFrom: [
    "components/**/*.vue",
    "layouts/**/*.vue",
    "pages/**/*.vue",
    "lib/**/*.ts",
    "plugins/**/*.ts",
    "store/**/*.ts",
    "src/**/*.ts",
  ],
  testEnvironment: 'jsdom',
};
