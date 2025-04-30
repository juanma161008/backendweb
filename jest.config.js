export default {
  transform: {},
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    "!src/index.js",
    '!**/node_modules/**'
  ]
};
