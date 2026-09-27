import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // Files and directories ESLint should completely ignore.
  {
    ignores: [
      "node_modules/",
      "dist/",
      "coverage/",
    ],
  },

  // ESLint's recommended JavaScript rules.
  eslint.configs.recommended,

  // Recommended rules for TypeScript.
  ...tseslint.configs.recommended,

  // Disables ESLint formatting rules that conflict with Prettier.
  prettier,

  {
    // Apply these settings to TypeScript source files.
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      // Tell ESLint that this code runs in Node.js.
      globals: {
        ...globals.node,
      },
    },

    rules: {
      /**
       * Prevent unused variables and imports.
       *
       * Variables beginning with "_" are intentionally allowed
       * to remain unused. This is useful for parameters that
       * are required by an interface but aren't needed.
       */
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      /**
       * We don't require explicit return types for every function.
       * TypeScript can usually infer them correctly.
       */
      "@typescript-eslint/explicit-function-return-type": "off",

      /**
       * `any` is allowed temporarily but produces a warning.
       *
       * This lets us move quickly while still reminding us
       * to replace `any` with proper types later.
       */
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);