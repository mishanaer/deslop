import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import { transformWithEsbuild } from "vite"

const resolve = (path) => fileURLToPath(new URL(path, import.meta.url))
const aliasEntries = (aliases) =>
    Array.isArray(aliases)
        ? aliases
        : Object.entries(aliases ?? {}).map(([find, replacement]) => ({
              find,
              replacement,
          }))

const jsxInJs = () => ({
    name: "deslop-jsx-in-js",
    enforce: "pre",
    async transform(code, id) {
        if (id.includes("node_modules") || !id.endsWith(".js")) return null
        return transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: "automatic",
        })
    },
})

const config = {
    stories: ["../stories/**/*.stories.{js,jsx}"],
    staticDirs: ["../public"],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    core: {
        disableTelemetry: true,
    },
    async viteFinal(viteConfig) {
        // Storybook copies `staticDirs` itself; disabling Vite's implicit
        // `public/` copy prevents the same directory from being copied twice.
        viteConfig.publicDir = false
        viteConfig.plugins = [
            jsxInJs(),
            ...(viteConfig.plugins ?? []),
            tailwindcss(),
        ]
        viteConfig.resolve = {
            ...viteConfig.resolve,
            alias: [
                {
                    find: "@components",
                    replacement: resolve("../../components"),
                },
                { find: "@hooks", replacement: resolve("../../hooks") },
                { find: "@lib", replacement: resolve("../../lib") },
                { find: "@theme", replacement: resolve("../../theme") },
                { find: "@mini-utils", replacement: resolve("../../utils") },
                {
                    find: "@primitives",
                    replacement: resolve("../../../primitives"),
                },
                { find: "@utils", replacement: resolve("../examples/utils") },
                { find: "@icons", replacement: resolve("../assets/icons") },
                { find: "@images", replacement: resolve("../assets/images") },
                {
                    find: /^@lisse\/core$/,
                    replacement: resolve("../node_modules/@lisse/core"),
                },
                {
                    find: /^@lisse\/react$/,
                    replacement: resolve("../node_modules/@lisse/react"),
                },
                {
                    find: /^@tanstack\/react-virtual$/,
                    replacement: resolve(
                        "../node_modules/@tanstack/react-virtual"
                    ),
                },
                {
                    find: /^calligraph$/,
                    replacement: resolve("../node_modules/calligraph"),
                },
                {
                    find: /^clsx$/,
                    replacement: resolve("../node_modules/clsx"),
                },
                {
                    find: /^colorthief$/,
                    replacement: resolve("../node_modules/colorthief"),
                },
                {
                    find: /^markdown-to-jsx$/,
                    replacement: resolve("../node_modules/markdown-to-jsx"),
                },
                {
                    find: "motion",
                    replacement: resolve("../node_modules/motion"),
                },
                {
                    find: /^prop-types$/,
                    replacement: resolve("../node_modules/prop-types"),
                },
                {
                    find: "react-dom",
                    replacement: resolve("../node_modules/react-dom"),
                },
                {
                    find: "react",
                    replacement: resolve("../node_modules/react"),
                },
                {
                    find: /^wouter\/use-hash-location$/,
                    replacement: resolve(
                        "../node_modules/wouter/src/use-hash-location.js"
                    ),
                },
                {
                    find: /^wouter$/,
                    replacement: resolve("../node_modules/wouter"),
                },
                ...aliasEntries(viteConfig.resolve?.alias),
            ],
            dedupe: ["react", "react-dom", "motion"],
        }
        viteConfig.optimizeDeps = {
            ...viteConfig.optimizeDeps,
            esbuildOptions: {
                ...viteConfig.optimizeDeps?.esbuildOptions,
                loader: {
                    ...viteConfig.optimizeDeps?.esbuildOptions?.loader,
                    ".js": "jsx",
                },
            },
        }
        viteConfig.server = {
            ...viteConfig.server,
            fs: {
                ...viteConfig.server?.fs,
                allow: [resolve("../../..")],
            },
        }
        return viteConfig
    },
}

export default config
