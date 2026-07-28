import Page from "@components/Page"
import SectionList from "@components/SectionList"
import { RegularButton } from "@components/Button"
import { useSnackbar } from "@components/Snackbar"

import { BackButton } from "@lib/twa"

import {
    IconArrowUp as ArrowUpIcon,
    IconCircleAlert as ExclamationIcon,
} from "@primitives/material-symbols-react"

const wrapperStyle = {
    padding: "12px var(--side-padding)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
}

const SnackbarExample = () => {
    const snackbar = useSnackbar()

    const showDefaultBottom = () =>
        snackbar.show({
            position: "bottom",
            icon: <ExclamationIcon />,
            title: "You need to go through the verification procedure to send 1,000 TON",
            link: { label: "Get verified" },
        })

    const showHardBottom = () =>
        snackbar.show({
            position: "bottom",
            icon: <ArrowUpIcon />,
            title: "bang.mp3 is too large",
            description: "The size is over 100 Kb.",
            action: { label: "Undo" },
        })

    const showDefaultTop = () =>
        snackbar.show({
            position: "top",
            icon: <ExclamationIcon />,
            title: "Saved as draft",
            link: { label: "View" },
        })

    const showPersistent = () =>
        snackbar.show({
            position: "bottom",
            duration: 0,
            icon: <ArrowUpIcon />,
            title: "Persistent toast",
            description: "Swipe to dismiss.",
            action: { label: "OK" },
        })

    const showSuccess = () =>
        snackbar.show({
            position: "bottom",
            type: "success",
            icon: <ArrowUpIcon />,
            title: "Transaction sent",
            description: "Your TON is on the way.",
        })

    const showError = () =>
        snackbar.show({
            position: "bottom",
            type: "error",
            icon: <ExclamationIcon />,
            title: "Transaction failed",
            description: "Network unreachable.",
            action: { label: "Retry" },
        })

    const showWarning = () =>
        snackbar.show({
            position: "bottom",
            type: "warning",
            icon: <ExclamationIcon />,
            title: "Low balance",
            description: "Top up to continue.",
        })

    return (
        <>
            <BackButton />
            <Page>
                <SectionList>
                    <SectionList.Item header="Bottom">
                        <div style={wrapperStyle}>
                            <RegularButton
                                variant="filled"
                                label="Default"
                                onClick={showDefaultBottom}
                            />
                            <RegularButton
                                variant="filled"
                                label="Hard"
                                onClick={showHardBottom}
                            />
                            <RegularButton
                                variant="outlined"
                                label="Persistent (no timer)"
                                onClick={showPersistent}
                            />
                        </div>
                    </SectionList.Item>

                    <SectionList.Item header="Top">
                        <div style={wrapperStyle}>
                            <RegularButton
                                variant="filled"
                                label="From Top"
                                onClick={showDefaultTop}
                            />
                        </div>
                    </SectionList.Item>

                    <SectionList.Item header="Type">
                        <div style={wrapperStyle}>
                            <RegularButton
                                variant="filled"
                                label="Success (haptic)"
                                onClick={showSuccess}
                            />
                            <RegularButton
                                variant="filled"
                                label="Error (haptic + shake)"
                                onClick={showError}
                            />
                            <RegularButton
                                variant="outlined"
                                label="Warning (haptic)"
                                onClick={showWarning}
                            />
                        </div>
                    </SectionList.Item>
                </SectionList>
            </Page>
        </>
    )
}

export default SnackbarExample
