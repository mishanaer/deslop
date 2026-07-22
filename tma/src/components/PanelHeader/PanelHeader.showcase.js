import PropTypes from "prop-types"

import Page from "../Page"
import SectionHeader from "../SectionHeader"
import PanelHeader from "../PanelHeader"

import { BackButton } from "../../lib/twa"
import ChevronLeftIcon from "@deslop/primitives/icons/chevron-left.svg?react"
import EllipsisIcon from "@deslop/primitives/icons/circle-more.svg?react"
import XmarkIcon from "@deslop/primitives/icons/cross.svg?react"

import * as styles from "./PanelHeader.showcase.module.css"

const noop = () => {}

const Sample = ({ label, over = false, children }) => (
    <div className={styles.section}>
        <SectionHeader title={label} />
        <div className={`${styles.canvas} ${over ? styles.over : ""}`}>
            {children}
        </div>
    </div>
)

Sample.propTypes = {
    label: PropTypes.string,
    over: PropTypes.bool,
    children: PropTypes.node,
}

const PanelHeaderShowcase = () => (
    <>
        <BackButton />
        <Page>
            <Sample label="Regular">
                <PanelHeader
                    left={<ChevronLeftIcon />}
                    onLeft={noop}
                    right={<EllipsisIcon />}
                    onRight={noop}
                >
                    Title
                </PanelHeader>
            </Sample>

            <Sample label="Icon + label">
                <PanelHeader
                    left={<XmarkIcon />}
                    onLeft={noop}
                    right="Done"
                    onRight={noop}
                >
                    Title
                </PanelHeader>
            </Sample>

            <Sample label="Secondary">
                <PanelHeader
                    left={<ChevronLeftIcon />}
                    onLeft={noop}
                    leftVariant="secondary"
                    right={<EllipsisIcon />}
                    onRight={noop}
                    rightVariant="secondary"
                >
                    Title
                </PanelHeader>
            </Sample>

            <Sample label="Accent">
                <PanelHeader
                    left={<XmarkIcon />}
                    onLeft={noop}
                    right="Done"
                    onRight={noop}
                    rightVariant="accent"
                >
                    Title
                </PanelHeader>
            </Sample>

            <Sample label="Overlay" over>
                <PanelHeader
                    left={<ChevronLeftIcon />}
                    onLeft={noop}
                    right={<EllipsisIcon />}
                    onRight={noop}
                    overlay
                >
                    Title
                </PanelHeader>
            </Sample>

            <Sample label="Title capsule">
                <PanelHeader
                    left={<ChevronLeftIcon />}
                    onLeft={noop}
                    right={<EllipsisIcon />}
                    onRight={noop}
                    titleGlass
                >
                    Title
                </PanelHeader>
            </Sample>
        </Page>
    </>
)

export default PanelHeaderShowcase
