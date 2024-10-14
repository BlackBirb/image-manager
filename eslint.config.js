import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import _import from 'eslint-plugin-import'
// import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
// import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const eslintConfig = [
  {
    ignores: [
      'node_modules/*',
      '.out/*',
      '!.prettierrc.js',
      'dist/*',
      'dist-electron/*',
      'build/*',
      'vite.config.mjs',
      'vite.config.mjs.timestamp-*.mjs',
      'eslint.config.mjs',
      'src/lib/wasm_exec.js',
      'src/lib/wasm_wrapper.js',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
      'plugin:import/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      // 'plugin:unused-imports',
    ),
  ),
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      // 'unused-imports': unusedImports,
      // 'no-relative-import-paths': noRelativeImportPaths,
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
      },

      ecmaVersion: 2018,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },

      'import/resolver': {
        typescript: {},
        node: true,
      },
    },

    rules: {
      'import/no-unresolved': 'error',
      // 'unused-imports/no-unused-imports': 'error',
      // See https://github.com/import-js/eslint-plugin-import/pull/2873
      'import/namespace': 'off',

      // 'no-relative-import-paths/no-relative-import-paths': [
      //   'warn',
      //   {
      //     allowSameFolder: true,
      //   },
      // ],

      'react/jsx-curly-brace-presence': [
        1,
        {
          props: 'never',
          children: 'never',
        },
      ],

      'react/prop-types': [
        'error',
        {
          skipUndeclared: true,
        },
      ],

      'no-duplicate-imports': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/no-children-prop': 'error',

      'no-console': [
        'error',
        {
          allow: ['error', 'info'],
        },
      ],

      'react/no-array-index-key': 'warn',
      'react-hooks/rules-of-hooks': 'error',

      'max-len': [
        'error',
        {
          code: 120,
          ignoreUrls: true,
          ignoreStrings: true,
          tabWidth: 2,
          ignoreTrailingComments: true,
        },
      ],

      'import/no-anonymous-default-export': [
        'error',
        {
          allowObject: true,
        },
      ],

      'import/first': 2,

      'import/order': [
        'warn',
        {
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],

          groups: ['builtin', 'external', 'internal', 'type', ['sibling', 'parent', 'index'], 'object'],

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },

          'newlines-between': 'always',
        },
      ],

      'max-depth': ['error', 5],
      'linebreak-style': ['error', 'unix'],

      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],

      '@typescript-eslint/no-empty-interface': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-shadow': 'error',

      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      // 'react-hooks/exhaustive-deps': 'off',
      // '@typescript-eslint/ban-ts-comment': 'off',
      // '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  ...fixupConfigRules(compat.extends('plugin:@typescript-eslint/recommended')).map((config) => ({
    ...config,
    files: ['**/*.d.ts'],
  })),
  {
    files: ['**/*.d.ts'],

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      'no-use-before-define': 'warn',
    },
  },
]

export default eslintConfig
