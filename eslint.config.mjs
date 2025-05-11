import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import perfectionist from "eslint-plugin-perfectionist";
import importPlugin from "eslint-plugin-import";
import unicorn from "eslint-plugin-unicorn";
import prettier from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsparser,
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      pluginJs,
      "@typescript-eslint": tseslint,
      perfectionist,
      import: importPlugin,
      unicorn,
      prettier,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.strict.rules,
      ...tseslint.configs.stylistic.rules,
      ...unicorn.configs["flat/recommended"].rules,
      curly: ["error", "all"],
      "max-lines-per-function": [
        "error",
        { max: 40, skipBlankLines: true, skipComments: true },
      ],
      "no-magic-numbers": ["error"],
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "import/order": ["error", { "newlines-between": "always" }],
      "unicorn/better-regex": "error",
      "unicorn/no-null": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            arguments: false,
          },
        },
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "explicit",
          overrides: {
            constructors: "off",
          },
        },
      ],
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      "@typescript-eslint/member-ordering": "error",
      "class-methods-use-this": "error",
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts"],
      },
    },
  },
];
