const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const importPlugin = require('eslint-plugin-import');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/use-component-view-encapsulation': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',

      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'enumMember', format: ['PascalCase'] },
      ],

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'unused-imports/no-unused-imports': 'error',

      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'no-multiple-empty-lines': 'error',
      'newline-before-return': 'error',
      'no-multi-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'eol-last': ['error', 'always'],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/no-distracting-elements': 'error',
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/conditional-complexity': ['error', { maxComplexity: 5 }],
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      '@angular-eslint/template/prefer-ngsrc': 'warn',
      '@angular-eslint/template/no-call-expression': 'off', // TODO: set @angular-eslint/template/no-call-expression": "error" when Angular signal() is no longer flagged as a call expression by the linter.
      '@angular-eslint/template/attributes-order': 'off', // controlled by Prettier
    },
  },
);
