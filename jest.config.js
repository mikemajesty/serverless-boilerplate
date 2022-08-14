const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.paths.json');

module.exports = {
  collectCoverage: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['src'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coveragePathIgnorePatterns: ['node_modules', 'coverage', '.esbuild/*', '.serverless/*'],
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coverageThreshold: {
    global: {
      lines: 90,
      statements: 90,
      functions: 80,
      branches: 60,
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  coverageReporters: ['json-summary', 'lcov'],
};