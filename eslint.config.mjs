import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tailwind from "eslint-plugin-tailwindcss";
import neostandard from "neostandard";

const eslintConfig = defineConfig([
  ...neostandard(),

  // ── Tailwind CSS plugin ───────────────────────────────────────────────────
  // Warns on wrong class order, shorthand violations, contradicting classes.
  // src/style.css is the v4 entry-point the plugin uses to resolve the theme.
  tailwind.configs.recommended,
  {
    settings: {
      tailwindcss: {
        config: "src/style.css",
      },
    },
  },

  // ── Next.js recommended rules ─────────────────────────────────────────────
  ...nextVitals,
  ...nextTs,

  // ── Import ordering & hygiene ─────────────────────────────────────────────
  // simple-import-sort: auto-sortable import/export order (works with --fix)
  // import-x: catches missing modules, duplicate imports, and named exports
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "import-x": importX,
    },
    rules: {
      // Auto-sort import and export statements
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1. Side-effect imports (e.g. `import "./polyfills"`)
            ["^\\u0000"],
            // 2. Node built-ins (node:fs, node:path …)
            ["^node:"],
            // 3. React / Next.js packages first
            ["^react", "^next"],
            // 4. All other external packages
            ["^@?\\w"],
            // 5. Internal path aliases (@/ or ~/)
            ["^@/", "^~/"],
            // 6. Relative imports — parent dirs first, then same dir
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // 7. Style imports last
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      // import-x hygiene rules
      "import-x/no-duplicates": "error",        // no duplicate import sources
      "import-x/no-self-import": "error",       // no file importing itself
      "import-x/no-useless-path-segments": "warn", // clean up ../index etc.
      "import-x/first": "error",                // imports must come first
    },
  },

  // ── Turn off all style rules that Prettier owns ───────────────────────────
  // Must come LAST so it wins over everything above.
  eslintConfigPrettier,

  // ── Project-level overrides ───────────────────────────────────────────────
  {
    rules: {
      // Next.js/Google font loader uses SCREAMING_SNAKE_CASE variable names
      // such as `Geist_Mono`. We cannot rename them, so allow them explicitly.
      camelcase: ["error", { allow: ["Geist_Mono", "Geist_Sans"] }],
    },
  },

  // ── Global ignores ────────────────────────────────────────────────────────
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/style.css",
  ]),
]);

export default eslintConfig;
