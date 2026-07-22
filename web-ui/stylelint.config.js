/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: ['global'],
    }],
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*$|^[a-z][a-z0-9-_]+$|^[A-Z][a-zA-Z0-9]*$',
      { message: 'Expected class name to be kebab-case, camelCase, PascalCase or snake_case' },
    ],
    'custom-property-pattern': null,
  },
};
