import { fileURLToPath } from "node:url";
import { transformWithEsbuild } from "../../mini-app/storybook/node_modules/vite/dist/node/index.js";

const resolve = (path) => fileURLToPath(new URL(path, import.meta.url));

const jsxInJs = () => ({
  name: "deslop-serega-jsx-in-js",
  enforce: "pre",
  async transform(code, id) {
    const cleanId = id.split("?", 1)[0];
    if (cleanId.includes("node_modules") || !cleanId.endsWith(".js")) {
      return null;
    }
    return transformWithEsbuild(code, cleanId, {
      loader: "jsx",
      jsx: "automatic",
    });
  },
});

export default {
  base: "/serega/storybook/",
  plugins: [jsxInJs()],
  resolve: {
    alias: [
      {
        find: "motion",
        replacement: resolve("../../mini-app/storybook/node_modules/motion"),
      },
      {
        find: /^prop-types$/,
        replacement: resolve(
          "../../mini-app/storybook/node_modules/prop-types",
        ),
      },
      {
        find: "react-dom",
        replacement: resolve("../../mini-app/storybook/node_modules/react-dom"),
      },
      {
        find: "react",
        replacement: resolve("../../mini-app/storybook/node_modules/react"),
      },
    ],
    dedupe: ["react", "react-dom", "motion"],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  server: {
    fs: {
      allow: [resolve("../..")],
    },
  },
};
