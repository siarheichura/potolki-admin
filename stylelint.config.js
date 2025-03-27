const sortOrderSmacss = require('stylelint-config-property-sort-order-smacss/generate.js');

module.exports = {
  plugins: ['stylelint-scss', 'stylelint-order'],
  customSyntax: 'postcss-scss',
  rules: {
    'rule-empty-line-before': ['always', { except: ['first-nested'] }],
    'block-no-empty': true,
    'function-calc-no-unspaced-operator': true,
    'selector-pseudo-element-colon-notation': 'double',
    'length-zero-no-unit': true,
    'color-function-notation': 'modern',
    'font-family-name-quotes': 'always-unless-keyword',
    'scss/dollar-variable-empty-line-after': [
      'always',
      { except: ['last-nested', 'before-comment', 'before-dollar-variable'] },
    ],

    'order/order': [
      { type: 'at-rule', name: 'extend' },
      { type: 'at-rule', name: 'mixin' },
      'dollar-variables',
      { type: 'at-rule', name: 'include' },
      'custom-properties',
      'declarations',
      'rules',
      'at-rules',
    ],

    'order/properties-order': [
      sortOrderSmacss({ emptyLineBefore: 'always', noEmptyLineBetween: true }),
    ],
  },
};
