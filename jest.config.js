const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.paths.json');

module.exports = {
  collectCoverage: false,
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  rootDir: './src',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.{js,ts}'],
  coveragePathIgnorePatterns: ['index.ts', 'schema.ts', 'static/'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.js'],
  coverageThreshold: {
    global: {
      lines: 90,
      statements: 90,
      functions: 80,
      branches: 60,
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/..',
  }),
  coverageReporters: ['json-summary', 'lcov'],
};