import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, "package.json"), "utf8")
) as {
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}
const externalPackages = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
])

function isExternal(id: string) {
  return [...externalPackages].some(
    (packageName) => id === packageName || id.startsWith(`${packageName}/`)
  )
}

const entryGroups = [
  { output: "components/ui", source: "src/components/ui" },
  { output: "blocks", source: "src/components/blocks" },
  { output: "charts", source: "src/components/charts" },
]

const componentEntries = Object.fromEntries(
  entryGroups.flatMap(({ output, source }) => {
    const directory = path.resolve(__dirname, source)
    return readdirSync(directory)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => [
        `${output}/${file.replace(/\.tsx$/, "")}`,
        path.resolve(directory, file),
      ])
  })
)

export default defineConfig({
  plugins: [svgr(), react(), tailwindcss()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@deslop/primitives": path.resolve(__dirname, "../primitives"),
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        toast: path.resolve(__dirname, "src/toast.ts"),
        styles: path.resolve(__dirname, "src/index.css"),
        reset: path.resolve(__dirname, "src/reset.css"),
        ...componentEntries,
      },
      formats: ["es"],
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: isExternal,
      output: {
        entryFileNames: "[name].js",
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith(".css")
            ? "[name][extname]"
            : "assets/[name][extname]",
      },
    },
  },
})
