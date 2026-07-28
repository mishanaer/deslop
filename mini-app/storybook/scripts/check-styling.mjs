import { readdir, readFile } from "node:fs/promises"
import { extname, relative, resolve } from "node:path"

const storybookRoot = resolve(import.meta.dirname, "..")
const miniAppRoot = resolve(storybookRoot, "..")
const sourceRoots = [
    resolve(miniAppRoot, "components"),
    resolve(miniAppRoot, "hooks"),
    resolve(miniAppRoot, "lib"),
    resolve(miniAppRoot, "theme"),
    resolve(miniAppRoot, "utils"),
    resolve(storybookRoot, "examples"),
    resolve(storybookRoot, "stories"),
]

const walk = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true })
    return (
        await Promise.all(
            entries.map((entry) => {
                const path = resolve(directory, entry.name)
                return entry.isDirectory() ? walk(path) : [path]
            })
        )
    ).flat()
}

const files = (await Promise.all(sourceRoots.map(walk))).flat()
const codeFiles = files.filter((path) =>
    [".js", ".jsx", ".ts", ".tsx", ".css"].includes(extname(path))
)
const failures = []
const normalize = (path) => relative(miniAppRoot, path).replaceAll("\\", "/")

for (const path of codeFiles) {
    const source = await readFile(path, "utf8")
    const file = normalize(path)

    if (/primitives\/icons\/|icons-react/.test(source)) {
        failures.push(`${file} uses the removed SVG icon system`)
    }
    if (/from\s+["'](?:@mui\/|@chakra-ui\/|antd|lucide-react|react-icons|@radix-ui\/)/.test(source)) {
        failures.push(`${file} imports a second UI or icon library`)
    }
    if (
        !file.startsWith("storybook/") &&
        /from\s+["']@(?:components|hooks|lib|theme|mini-utils|primitives)\//.test(source)
    ) {
        failures.push(`${file} uses a Storybook-only path alias`)
    }
}

const componentFiles = files
    .filter((path) => path.startsWith(resolve(miniAppRoot, "components")))
    .map(normalize)
const misplacedExamples = componentFiles.filter((file) =>
    /\.(?:example|showcase)\./.test(file)
)
if (misplacedExamples.length) {
    failures.push(
        `Component examples must live in storybook/examples:\n${misplacedExamples.join("\n")}`
    )
}

if (failures.length) {
    console.error(`Structure check failed:\n\n${failures.map((item) => `- ${item}`).join("\n")}`)
    process.exitCode = 1
} else {
    console.log("Mini App runtime and bundled Storybook stay cleanly separated.")
}
