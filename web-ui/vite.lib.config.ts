import { readdirSync } from "node:fs"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

const componentsDirectory = path.resolve(__dirname, "src/components/ui")
const componentEntries = Object.fromEntries(
  readdirSync(componentsDirectory)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => [
      `components/ui/${file.replace(/\.tsx$/, "")}`,
      path.resolve(componentsDirectory, file),
    ])
)

export default defineConfig({
  plugins: [svgr(), react(), tailwindcss()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        ...componentEntries,
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        entryFileNames: "[name].js",
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith(".css")
            ? "styles.css"
            : "assets/[name][extname]",
      },
    },
  },
})
