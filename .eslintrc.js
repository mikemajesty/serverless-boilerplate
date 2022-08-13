module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json",
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint/eslint-plugin",
    "simple-import-sort",
    "security",
    "sonarjs",
    "jest"
  ],
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:security/recommended",
    "plugin:you-dont-need-lodash-underscore/compatible",
    "plugin:sonarjs/recommended",
    "plugin:jest/recommended"
  ],
  "root": true,
  "env": {
    "node": true,
    "jest": true,
    "jest/globals": true,
    "es2022": true
  },
  "ignorePatterns": [
    ".eslintrc.json"
  ],
  "rules": {
    "jest/expect-expect": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-unused-vars": [
      "error"
    ],
    "@typescript-eslint/no-explicit-any": [
      "error"
    ],
    "security/detect-object-injection": [
      "error"
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "max-len": [
      "error",
      {
        "code": 120,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true,
        "ignoreStrings": true,
        "ignoreUrls": true
      }
    ],
    "no-console": [
      "error"
    ],
    "complexity": [
      "error",
      5
    ],
    "spaced-comment": [
      2,
      "always"
    ]
  }
};