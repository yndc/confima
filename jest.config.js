module.exports = {
  roots: ['<rootDir>/tests/suites'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '.ts',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1'
  }
}