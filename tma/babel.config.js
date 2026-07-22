export default (api) => {
    const isProd = api.env("production")
    api.cache.using(() => process.env.NODE_ENV)

    return {
        presets: [
            [
                "@babel/preset-react",
                {
                    runtime: "automatic",
                    importSource: "react",
                },
            ],
        ],
        plugins: [
            // Strip propTypes BEFORE the compiler runs: the remover only
            // recognises plain components, and react-compiler rewrites them
            // into a form (`function C(t0){ const $ = _c(n); ... }`) it no
            // longer matches, so compiler-first leaves propTypes in the bundle.
            // The remover only touches the static `C.propTypes` assignment, not
            // JSX or component bodies, so running it first is safe for compiler.
            ...(isProd
                ? [
                      [
                          "transform-react-remove-prop-types",
                          {
                              removeImport: true,
                              additionalLibraries: ["prop-types"],
                          },
                      ],
                  ]
                : []),
            "babel-plugin-react-compiler",
        ],
    }
}
