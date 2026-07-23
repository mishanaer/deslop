import SectionList from "../../../src/components/SectionList"
import Cell from "../../../src/components/Cells"
import TransitionLink from "../../../src/components/Link"

import config from "../../config"
import {
    categoryToPrefix,
    titleToSlug,
    sortedPages,
} from "../../configHelpers"

const sorted = sortedPages(config)

const preload = (component) => {
    component?.preload?.()
}

// Reusable catalog master list. Renders the config-driven page index as cells.
// Used both as the full-screen CatalogPage (narrow) and the SplitView sidebar.
const CatalogList = () => (
    <SectionList>
        {sorted.map(({ category, pages }) => {
            const prefix = categoryToPrefix(category)
            return (
                <SectionList.Item header={category} key={category}>
                    {pages.map(({ title, slug, component }) => {
                        const resolvedSlug = slug || titleToSlug(title)
                        const handlePreload = () => preload(component)
                        return (
                            <Cell
                                as={TransitionLink}
                                to={`/${prefix}/${resolvedSlug}`}
                                end={<Cell.Part type="Chevron" />}
                                key={resolvedSlug}
                                onMouseEnter={handlePreload}
                                onFocus={handlePreload}
                                onTouchStart={handlePreload}
                            >
                                <Cell.Text title={title} />
                            </Cell>
                        )
                    })}
                </SectionList.Item>
            )
        })}
    </SectionList>
)

export default CatalogList
