import { useState } from "react"
import PropTypes from "prop-types"

import Page from "../Page"
import SectionList from "../SectionList"
import Cell from "../Cells"
import Gallery from "../Gallery"
import Text from "../Text"

import { BackButton } from "../../lib/twa"
import { accentColors } from "@deslop/primitives/tokens"

const colors = ["Red", "Mint", "Cyan", "Green"].map(
    (name) => accentColors.find((color) => color.name === name).light
)

const GalleryPage = ({ color, label }) => (
    <div
        style={{
            width: "100%",
            height: 200,
            backgroundColor: color,
            color: "var(--mini-app-static-white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
        }}
    >
        <Text variant="title2" weight="bold">
            {label}
        </Text>
    </div>
)

GalleryPage.propTypes = {
    color: PropTypes.string,
    label: PropTypes.string,
}

const GalleryShowcase = () => {
    const [page, setPage] = useState(0)

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item header="Gallery">
                        <Gallery onPageChange={setPage}>
                            {colors.map((color, i) => (
                                <GalleryPage
                                    key={color}
                                    color={color}
                                    label={`Page ${i + 1}`}
                                />
                            ))}
                        </Gallery>
                    </SectionList.Item>

                    <SectionList.Item>
                        <Cell>
                            <Cell.Text
                                title="Current Page"
                                description={`${page + 1} of ${colors.length}`}
                            />
                        </Cell>
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default GalleryShowcase
