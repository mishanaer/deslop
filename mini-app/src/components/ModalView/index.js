import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { AnimatePresence } from "motion/react"
import { componentRadiusPixels, radiusPixels } from "@deslop/primitives/layout"
import * as styles from "./ModalView.module.css"

import WebApp, { BackButton } from "../../lib/twa"

import ModalPage, { parsePages } from "./ModalPage"
import TrayPages from "./TrayPages"
import ModalPanel from "./ModalPanel"
import { ModalChromeContext } from "../PanelHeader/context"
import { useDismissDrag } from "./useDismissDrag"
import { useFocusTrap } from "../../hooks/useFocusTrap"
import { useSplitView } from "../../hooks/useSplitView"
import { useSkin } from "../../hooks/DeviceProvider"
import { SPRING } from "../../utils/animations"
import { getMiniAppColor } from "../../theme/colors"

const getHeaderColor = () => getMiniAppColor("background-secondary")

// Squircle the panel corners (34px Apple, 16px Material). The sheet rounds its
// top edge only; the centred dialog rounds all four. CSS border-radius is the
// fallback shape.
const APPLE_RADIUS = componentRadiusPixels.modal
const MATERIAL_RADIUS = radiusPixels["16"]
const SMOOTHING = 0.6

// Entrance/exit read the viewport at animation time (not mount time) so the
// slide stays correct after keyboard-driven viewport resizes.
const panelVariants = {
    hidden: () => ({ y: window.innerHeight }),
    visible: { y: 0, transition: SPRING.MODAL },
    exit: () => ({
        y: window.innerHeight,
        transition: { duration: 0.2, ease: "easeOut" },
    }),
}

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, ease: "linear" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "linear" } },
}

const ModalView = ({
    isOpen,
    onClose,
    initialPage,
    style,
    children,
    ...props
}) => {
    const modalRef = useRef(null)
    const isWide = useSplitView()
    const { isApple } = useSkin()

    const pages = parsePages(children)
    const isTray = pages !== null
    const rootId = initialPage ?? pages?.[0]?.id

    const [nav, setNav] = useState({
        stack: [rootId],
        direction: 0,
        wasOpen: isOpen,
    })
    // Reset to the root page when (re)opening; keep the stack while closing so
    // the exiting panel still shows the page the user was on.
    if (isOpen !== nav.wasOpen) {
        setNav(
            isOpen
                ? { stack: [rootId], direction: 0, wasOpen: true }
                : { ...nav, wasOpen: false }
        )
    }

    const canPop = nav.stack.length > 1
    const activeId = nav.stack[nav.stack.length - 1]
    const push = (id) =>
        setNav((state) => ({
            ...state,
            stack: [...state.stack, id],
            direction: 1,
        }))
    const pop = () =>
        setNav((state) =>
            state.stack.length > 1
                ? { ...state, stack: state.stack.slice(0, -1), direction: -1 }
                : state
        )

    const { y, overlayOpacity, dragProps, onPanelPointerDown } = useDismissDrag(
        { onClose, panelRef: modalRef }
    )

    useFocusTrap(modalRef, isOpen)

    // Cleanup restores on close AND on unmount-while-open; a closed modal
    // never touches the page chrome, so mounting one cannot clobber a header
    // color the host page set itself.
    useEffect(() => {
        if (!isOpen) return
        const headerColor = getHeaderColor()
        document.body.style.overflow = "hidden"
        WebApp.disableVerticalSwipes?.()
        WebApp.setHeaderColor(getMiniAppColor("background"))
        return () => {
            document.body.style.overflow = "auto"
            WebApp.enableVerticalSwipes?.()
            WebApp.setHeaderColor(headerColor)
        }
    }, [isOpen])

    // Escape mirrors the BackButton: pop first, close from the root page.
    useEffect(() => {
        if (!isOpen) return
        const onKeyDown = (event) => {
            if (event.key !== "Escape") return
            if (canPop) pop()
            else onClose()
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [isOpen, canPop, pop, onClose])

    const overlayClass = [
        styles.overlay,
        isWide ? styles.centered : styles.sheet,
    ].join(" ")
    // The panel is a child of the overlay, so overlay opacity dims everything
    // inside. On the phone sheet that must not track the drag — the sheet
    // stays opaque and slides; the overlay gets a plain enter/exit fade. Only
    // the centered split-view dialog fades along with the gesture.
    const overlayMotion = isWide
        ? { style: { opacity: overlayOpacity } }
        : {
              variants: overlayVariants,
              initial: "hidden",
              animate: "visible",
              exit: "exit",
          }
    const panelClass = [
        styles.panel,
        isWide ? styles.dialog : styles.bottomSheet,
        !isTray && styles.plain,
    ]
        .filter(Boolean)
        .join(" ")
    const corner = {
        radius: isApple ? APPLE_RADIUS : MATERIAL_RADIUS,
        smoothing: SMOOTHING,
    }
    const corners = isWide
        ? corner
        : { topLeft: corner, topRight: corner, bottomLeft: 0, bottomRight: 0 }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <BackButton onClick={canPop ? pop : onClose} />
                    <m.div
                        className={overlayClass}
                        {...overlayMotion}
                        onClick={onClose}
                    >
                        <ModalPanel
                            panelRef={modalRef}
                            corners={corners}
                            role="dialog"
                            aria-modal="true"
                            className={panelClass}
                            variants={panelVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{ ...style, y }}
                            {...dragProps}
                            onPointerDown={onPanelPointerDown}
                            onClick={(event) => event.stopPropagation()}
                            {...props}
                        >
                            <ModalChromeContext.Provider value={true}>
                                {isTray ? (
                                    <TrayPages
                                        pages={pages}
                                        activeId={activeId}
                                        depth={nav.stack.length}
                                        direction={nav.direction}
                                        nav={{
                                            push,
                                            pop,
                                            canPop,
                                            activeId,
                                            close: onClose,
                                        }}
                                    />
                                ) : (
                                    <div className={styles.content}>
                                        {children}
                                    </div>
                                )}
                            </ModalChromeContext.Provider>
                        </ModalPanel>
                    </m.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}

ModalView.Page = ModalPage

ModalView.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    initialPage: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
}

export default ModalView
