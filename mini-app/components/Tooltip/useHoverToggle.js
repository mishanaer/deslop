import { useEffect, useRef } from "react"

const OPEN_DELAY = 80
const CLOSE_DELAY = 120

export const useHoverToggle = ({ onOpen, onClose }) => {
    const openTimerRef = useRef(null)
    const closeTimerRef = useRef(null)

    const clearOpenTimer = () => {
        if (openTimerRef.current) {
            clearTimeout(openTimerRef.current)
            openTimerRef.current = null
        }
    }

    const clearCloseTimer = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current)
            closeTimerRef.current = null
        }
    }

    useEffect(
        () => () => {
            clearOpenTimer()
            clearCloseTimer()
        },
        [clearOpenTimer, clearCloseTimer]
    )

    const scheduleOpen = () => {
        clearCloseTimer()
        if (openTimerRef.current) return
        openTimerRef.current = setTimeout(() => {
            openTimerRef.current = null
            onOpen()
        }, OPEN_DELAY)
    }

    const scheduleClose = () => {
        clearOpenTimer()
        if (closeTimerRef.current) return
        closeTimerRef.current = setTimeout(() => {
            closeTimerRef.current = null
            onClose()
        }, CLOSE_DELAY)
    }

    const onPointerEnter = (e) => {
        if (e.pointerType === "touch") return
        scheduleOpen()
    }

    const onPointerLeave = (e) => {
        if (e.pointerType === "touch") return
        scheduleClose()
    }

    return { onPointerEnter, onPointerLeave, clearOpenTimer, clearCloseTimer }
}
