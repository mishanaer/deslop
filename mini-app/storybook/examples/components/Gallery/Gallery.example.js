import { useState } from "react"
import PropTypes from "prop-types"

import Page from "@components/Page"
import SectionList from "@components/SectionList"
import Cell from "@components/Cells"
import Gallery from "@components/Gallery"
import Text from "@components/Text"

import { BackButton } from "@lib/twa"
import { accentColors } from "@primitives/tokens"

const colors = ["Red", "Mint", "Cyan", "Green"].map(
    (name) => accentColors.find((color) => color.name === name).light
)

const GalleryPage = ({ color, label }) => (
    <div
        style={{
            width: "100%",
            height: 200,
            backgroundColor: color,
            color: "var(--white)",
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

const GalleryExample = () => {
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

export default GalleryExample
