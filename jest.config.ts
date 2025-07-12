/** @type {import('ts-jest').JestConfigWithTsJest} **/

import { createJsWithTsEsmPreset, type JestConfigWithTsJest } from 'ts-jest'

const presetConfig = createJsWithTsEsmPreset({
  tsconfig: "./tsconfig.test.json",
  diagnostics: {
    ignoreCodes: [1343],
  },
  astTransformers: {
    before: [
      {
        path: "ts-jest-mock-import-meta", // or, alternatively, 'ts-jest-mock-import-meta' directly, without node_modules.
        options: { metaObjectReplacement: { url: "https://www.url.com" } },
      },
    ],
  },
});

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/tests/__mocks__/fileMock.js",
    "^.+\\.svg$": "jest-transformer-svg",
    "src/(.*)": "<rootDir>/src/$1",
    "^[\w.\/]*consts$": "<rootDir>/tests/utils/__mocks__/consts.ts" // Or .js if you prefer
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", '@testing-library/jest-dom/'],
};

export default jestConfig