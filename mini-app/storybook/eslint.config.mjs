import js from "@eslint/js"
import globals from "globals"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import prettierConfig from "eslint-config-prettier"

export default [
    {
        ignores: [
            ".vite/",
            "build/",
            "dist/",
            "storybook/node_modules/",
            "storybook/storybook-static/",
        ],
    },
    js.configs.recommended,
    {
        files: [
            "storybook/{.storybook,stories,examples}/**/*.{js,jsx,ts,tsx}",
            "{components,hooks,lib,theme,utils}/**/*.{js,jsx,ts,tsx}",
            "{MiniAppProvider,index}.js",
        ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooks,
        },
        rules: {
            ...reactPlugin.configs.flat.recommended.rules,
            ...reactPlugin.configs.flat["jsx-runtime"].rules,
            ...reactHooks.configs.flat.recommended.rules,

            "react/prop-types": "error",
            "react/display-name": "off",
            "react/jsx-key": "error",
            "react-hooks/set-state-in-effect": "off",
            // React Compiler handles dependency tracking; this static check is redundant under it.
            "react-hooks/exhaustive-deps": "off",
            "no-console": ["warn", { allow: ["warn", "error"] }],
        },
    },
    {
        files: [
            "storybook/bin/**/*.mjs",
            "agent/**/*.mjs",
            "storybook/scripts/check-agent-kit.mjs",
            "storybook/scripts/check-styling.mjs",
        ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
    },
    prettierConfig,
]
