import { defineConfig } from "vite"
import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"
import checker from "vite-plugin-checker"
import webpackStatsPlugin from "rollup-plugin-webpack-stats"

const srcPath = fileURLToPath(new URL("./src", import.meta.url))
const projectPath = fileURLToPath(new URL(".", import.meta.url))
const storybookPath = fileURLToPath(new URL("./storybook", import.meta.url))
const primitivesPath = fileURLToPath(
    new URL("../primitives", import.meta.url)
)
const reactPath = fileURLToPath(
    new URL("./node_modules/react", import.meta.url)
)

export default defineConfig(({ command }) => ({
    base: "./",
    plugins: [
        react({
            include: /\.(jsx?|tsx?)$/,
            babel: {
                configFile: true,
            },
        }),
        command === "serve" &&
            checker({
                overlay: { initialIsOpen: false },
                eslint: {
                    useFlatConfig: true,
                    lintCommand:
                        "eslint '{src,storybook}/**/*.{js,jsx,ts,tsx}'",
                },
                stylelint: {
                    lintCommand: "stylelint '{src,storybook}/**/*.scss'",
                },
            }),
        svgr({
            svgrOptions: {
                svgoConfig: {
                    plugins: [
                        {
                            name: "preset-default",
                            params: {
                                overrides: {
                                    removeViewBox: false,
                                },
                            },
                        },
                    ],
                },
            },
        }),
        webpackStatsPlugin({
            filename: "./build/webpack-stats.json",
            transform: (stats, _sources, bundle) => {
                // Strip source maps: with sourcemap: "hidden" they never ship to
                // the client, so counting them in RelativeCI's totals is noise.
                stats.assets = (stats.assets || []).filter(
                    (a) => !a.name.endsWith(".map")
                )
                stats.chunks = (stats.chunks || []).map((chunk) => ({
                    ...chunk,
                    files: chunk.files.filter((f) => !f.endsWith(".map")),
                }))

                // Vite emits CSS as Rollup assets, not chunk files, so default
                // stats leave chunk.files without any .css entries and RelativeCI
                // classifies Initial CSS as 0 B. Reattach each chunk's imported
                // CSS via chunk.viteMetadata.importedCss.
                if (bundle) {
                    const chunkByFile = new Map()
                    stats.chunks.forEach((chunk) => {
                        chunk.files.forEach((file) =>
                            chunkByFile.set(file, chunk)
                        )
                    })
                    Object.values(bundle).forEach((entry) => {
                        if (entry.type !== "chunk") return
                        const css = entry.viteMetadata?.importedCss
                        if (!css || css.size === 0) return
                        const target = chunkByFile.get(entry.fileName)
                        if (!target) return
                        css.forEach((cssFile) => {
                            if (!target.files.includes(cssFile))
                                target.files.push(cssFile)
                        })
                    })
                }

                return stats
            },
        }),
    ],
    esbuild: {
        loader: "jsx",
        include: /src\/.*\.js$/,
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                ".js": "jsx",
            },
        },
    },
    resolve: {
        alias: {
            "@": srcPath,
            "@components": `${srcPath}/components`,
            "@hooks": `${srcPath}/hooks`,
            "@pages": `${srcPath}/pages`,
            "@router": `${storybookPath}/router`,
            "@utils": `${srcPath}/utils`,
            "@lib": `${srcPath}/lib`,
            "@icons": `${srcPath}/icons`,
            "@images": `${srcPath}/images`,
            "@deslop/primitives": primitivesPath,
            react: reactPath,
        },
    },
    build: {
        outDir: "build",
        assetsDir: "",
        sourcemap: "hidden",
        rollupOptions: {
            output: {
                assetFileNames: "assets/[name].[hash][extname]",
                chunkFileNames: "assets/[name].[hash].js",
                entryFileNames: "assets/[name].[hash].js",
                // Only pin the always-loaded libs to stable chunks for long-term
                // caching; everything else splits per usage point, so page-only deps
                // (markdown-to-jsx, colorthief, calligraph) stay out of
                // the startup path.
                manualChunks(id) {
                    if (!id.includes("node_modules")) return
                    if (
                        /\/node_modules\/(react|react-dom|scheduler)\//.test(id)
                    )
                        return "react"
                    if (
                        /\/node_modules\/(motion|framer-motion|motion-dom|motion-utils)\//.test(
                            id
                        )
                    )
                        return "motion"
                },
            },
        },
    },
    server: {
        port: 3000,
        open: false,
        fs: {
            allow: [projectPath, primitivesPath],
        },
        warmup: {
            clientFiles: [
                "./src/index.js",
                "./src/App.js",
                "./storybook/router/index.js",
                "./storybook/config.js",
                "./storybook/components/CatalogPage/index.js",
                "./src/components/PageTransition/index.js",
                "./src/components/Page/index.js",
                "./src/components/Text/index.js",
                "./src/components/Cells/index.js",
            ],
        },
    },
}))
