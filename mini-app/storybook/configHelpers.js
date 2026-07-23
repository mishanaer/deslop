import pageSkeletons from "./pageSkeletons"

const PREFIX_MAP = {
    Primitives: "ui-kit",
    Components: "showcase",
    "Text Effects": "text-effects",
    Telegram: "telegram",
    Prototypes: "prototype",
}

export function categoryToPrefix(category) {
    return PREFIX_MAP[category] || category.toLowerCase()
}

export function titleToSlug(title) {
    const words = title.split(/\s+/)
    return words
        .map((w, i) =>
            i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)
        )
        .join("")
}

export function sortedPages(config) {
    return config.map((group) => ({
        ...group,
        pages: group.pages.toSorted((a, b) => a.title.localeCompare(b.title)),
    }))
}

// Routes that may render inside a SplitView detail pane. All current categories
// are eligible; this is the single place to opt a route out (e.g. a full-bleed
// flow that should stay full-screen).
export function isSplitEligible(location) {
    return (
        location === "/" ||
        location.startsWith("/ui-kit/") ||
        location.startsWith("/showcase/") ||
        location.startsWith("/text-effects/") ||
        location.startsWith("/telegram/") ||
        location.startsWith("/prototype/")
    )
}

export function flattenRoutes(config) {
    return sortedPages(config).flatMap(
        ({ category, pages, header: groupHeader }) => {
            const prefix = categoryToPrefix(category)
            return pages.map((page) => {
                const slug = page.slug || titleToSlug(page.title)
                return {
                    path: `/${prefix}/${slug}${page.routeSuffix || ""}`,
                    component: page.component,
                    // Per-screen loading skeleton: an explicit page.skeleton wins,
                    // otherwise fall back to the title-keyed registry (router uses
                    // PageSkeleton when neither is set).
                    skeleton: page.skeleton ?? pageSkeletons[page.title],
                    title: page.title,
                    slug,
                    // Browser-only AppBar; opt a route or whole group out.
                    header: page.header ?? groupHeader ?? true,
                }
            })
        }
    )
}
