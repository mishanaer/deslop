import PropTypes from "prop-types"
import { useState, useEffect } from "react"

import Page from "../../../components/Page"
import Gallery from "../../../components/Gallery"
import SectionHeader from "../../../components/SectionHeader"
import StartView from "../../../components/StartView"
import { RegularButton } from "../../../components/Button"

import WebApp, { BackButton } from "../../../lib/twa"

import * as styles from "./Onboarding.module.css"

const GalleryPages = [
    {
        imageClass: styles.coin,
        title: "Your TON Wallet",
        description:
            "Get access to all the features of TON blockchain directly in Telegram",
    },
    {
        imageClass: styles.disk,
        title: "Secure Ownership",
        description:
            "You have complete control of the Toncoin, collectibles, and jettons in your TON Wallet",
    },
    {
        imageClass: styles.planet,
        title: "Your Gateway to TON",
        description: "Access decentralized applications with your TON Wallet",
    },
]

const GalleryPage = ({ imageClass, title, description }) => (
    <div className={styles.root}>
        <div className={styles.cover}>
            <div className={`${styles.image} ${imageClass}`}></div>
        </div>
        <div className={styles.content}>
            <StartView title={title} description={description} />
        </div>
    </div>
)

GalleryPage.propTypes = {
    imageClass: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
}

const Onboarding = () => {
    const [, setCurrentPage] = useState(0)

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    useEffect(() => {
        WebApp.disableVerticalSwipes()
        const handleBackButton = () => {
            WebApp.enableVerticalSwipes()
        }

        WebApp.onEvent("backButtonClicked", handleBackButton)

        return () => {
            WebApp.offEvent("backButtonClicked", handleBackButton)
            // Restore swipes on unmount too: in split-view the prototype can be
            // left via the sidebar without ever hitting the BackButton.
            WebApp.enableVerticalSwipes()
        }
    }, [])

    return (
        <Page headerColor="131314">
            <BackButton />
            <Gallery onPageChange={handlePageChange}>
                {GalleryPages.map(
                    ({ imageClass, title, description }, index) => (
                        <GalleryPage
                            key={index}
                            imageClass={imageClass}
                            title={title}
                            description={description}
                        />
                    )
                )}
            </Gallery>
            <div className={styles.BottomButtons}>
                <RegularButton
                    variant="filled"
                    label="Start exploring TON"
                    isFill
                    isShine
                />
                <RegularButton
                    variant="tinted"
                    label="Add Existing Wallet"
                    isFill
                />
                <div className={styles.terms}>
                    <SectionHeader
                        type="Footer"
                        title="By continuing you agree to Terms of Service and User Agreement."
                    />
                </div>
            </div>
        </Page>
    )
}

export default Onboarding
