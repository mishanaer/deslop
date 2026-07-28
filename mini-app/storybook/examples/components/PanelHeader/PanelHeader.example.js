import PropTypes from "prop-types"

import Page from "@components/Page"
import SectionHeader from "@components/SectionHeader"
import PanelHeader from "@components/PanelHeader"

import { BackButton } from "@lib/twa"
import {
    IconArrowBackIosNew as ArrowBackIosNewIcon,
    IconCross as XmarkIcon,
    IconMore as EllipsisIcon,
} from "@primitives/material-symbols-react"

import * as styles from "./PanelHeader.example.module.css"

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

const PanelHeaderExample = () => (
    <>
        <BackButton />
        <Page>
            <Sample label="Regular">
                <PanelHeader
                    left={<ArrowBackIosNewIcon />}
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
                    left={<ArrowBackIosNewIcon />}
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
                    left={<ArrowBackIosNewIcon />}
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
                    left={<ArrowBackIosNewIcon />}
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

export default PanelHeaderExample
