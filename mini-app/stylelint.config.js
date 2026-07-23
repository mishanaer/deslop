/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'import-notation': 'string',
    'property-no-vendor-prefix': null,
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['global'],
    }],
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ['theme'],
    }],
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*$|^[a-z][a-z0-9-_]+$|^[A-Z][a-zA-Z0-9]*$',
      { message: 'Expected class name to be kebab-case, camelCase, PascalCase or snake_case' },
    ],
    'custom-property-pattern': null,
  },
  overrides: [
    {
      files: ['**/*.module.css', 'src/utils/viewTransition.css'],
      rules: {
        'declaration-property-value-no-unknown': null,
        'no-descending-specificity': null,
        'no-duplicate-selectors': null,
        'no-empty-source': null,
      },
    },
  ],
};
