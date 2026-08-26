import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Type-aware linting for application source (the files tsconfig.json covers).
  // eslint-config-next only wires up the non-type-checked typescript-eslint
  // rules; this layer adds the ones that need the type-checker — floating
  // promises, misused promises, unsafe `any` flow, etc.
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // An async function passed to a JSX event prop (onClick={handleLogout})
      // is a normal React pattern — keep the check for every other position.
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      // Next.js route handlers, generateMetadata, server components and
      // next-intl's getRequestConfig are async by contract even when a given
      // implementation has nothing to await.
      "@typescript-eslint/require-await": "off",
    },
  },

  // Test files: `const { foo } = mockedObject` trips unbound-method even though
  // the reference is never called with a stray `this`.
  {
    files: ["src/**/*.test.{ts,tsx}", "src/test-utils/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/unbound-method": "off",
    },
  },

  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    // Tooling/skill scripts, not application source.
    ".claude/**",
    ".impeccable/**",
  ]),
]);

export default eslintConfig;
