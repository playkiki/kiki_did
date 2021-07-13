module.exports = {
  setupFilesAfterEnv     : [ '<rootDir>/jest.setup.js', '<rootDir>/tests/index.js' ],
  testEnvironment        : 'node',
  // Exit the test suite immediately upon the first failing test suite
  bail                   : true,
  // Each individual test should be reported during the run
  verbose                : true,
  // setupFilesAfterEnv     : [ 'jest-extended' ],
  collectCoverageFrom    : [ 'src/**/*.{js,jsx}', '!**/node_modules/**' ],
  testPathIgnorePatterns : [ '/node_modules/' ],
  testMatch              : [ '<rootDir>/tests/**/*.(spec|test).js?(x)', '<rootDir>/tests/**/?(*.)+(spec|test).js?(x)' ]
};
