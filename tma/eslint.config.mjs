import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        ignores: ['build/', 'node_modules/'],
    },
    js.configs.recommended,
    {
        files: ['{src,storybook}/**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooks,
        },
        rules: {
            ...reactPlugin.configs.flat.recommended.rules,
            ...reactPlugin.configs.flat['jsx-runtime'].rules,
            ...reactHooks.configs.flat.recommended.rules,

            'react/prop-types': 'error',
            'react/display-name': 'off',
            'react/jsx-key': 'error',
            'react-hooks/set-state-in-effect': 'off',
            // React Compiler handles dependency tracking; this static check is redundant under it.
            'react-hooks/exhaustive-deps': 'off',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
        },
    },
    prettierConfig,
];
