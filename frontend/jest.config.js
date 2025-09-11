/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@tests/(.*)$": "<rootDir>/src/tests/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{ts,tsx}",
    "!src/**/layout.tsx",
    "!src/**/page.tsx",
    "!src/tests/**/*",
    "!src/components/tables/**/*",
    "!src/components/modals/**/*",
    "!src/components/ui-components/**/*",
    "!src/hooks/**/*",
    "!src/lib/**/*",
    "!src/utils/**/*",
    "!src/i18n/**/*",
    "!src/app/**/*",
    "!src/middleware.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/tests/**/*.{ts,tsx}",
  ],
};
