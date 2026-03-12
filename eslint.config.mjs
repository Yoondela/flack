import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**"
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    plugins: {
      import: importPlugin,
    },

    rules: {
      "@typescript-eslint/no-unused-vars": "warn",

      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal"],
          "newlines-between": "always",
        },
      ],
    },
  },

  prettier,
];
