import { fileURLToPath } from "node:url"

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

const srcPath = fileURLToPath(new URL("./src", import.meta.url))
const primitivesPath = fileURLToPath(new URL("../primitives", import.meta.url))
const reactPath = fileURLToPath(
    new URL("./node_modules/react", import.meta.url)
)

const externalPackages = [
    "@lisse/core",
    "@lisse/react",
    "@tanstack/react-virtual",
    "calligraph",
    "colorthief",
    "markdown-to-jsx",
    "motion",
    "react",
    "react-dom",
    "wouter",
]

const isExternal = (id) =>
    externalPackages.some((name) => id === name || id.startsWith(`${name}/`))

export default defineConfig({
    publicDir: false,
    plugins: [
        tailwindcss(),
        react({
            include: /\.(jsx?|tsx?)$/,
            babel: { configFile: true },
        }),
        svgr({
            svgrOptions: {
                svgoConfig: {
                    plugins: [
                        {
                            name: "preset-default",
                            params: { overrides: { removeViewBox: false } },
                        },
                    ],
                },
            },
        }),
    ],
    esbuild: {
        loader: "jsx",
        include: /src\/.*\.js$/,
    },
    resolve: {
        alias: {
            "@": srcPath,
            "@utils": `${srcPath}/utils`,
            "@deslop/primitives": primitivesPath,
            react: reactPath,
        },
    },
    build: {
        outDir: "dist",
        lib: {
            entry: fileURLToPath(new URL("./src/library.js", import.meta.url)),
            formats: ["es"],
            fileName: "index",
            cssFileName: "styles",
        },
        rollupOptions: {
            external: isExternal,
        },
    },
})
