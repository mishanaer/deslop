import { useEffect, useRef } from "react"

export const useClickOutside = (isOpen, onClose, ...refs) => {
    const onCloseRef = useRef(onClose)
    useEffect(() => {
        onCloseRef.current = onClose
    })

    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event) => {
            const isOutside = refs.every(
                (ref) => !ref.current || !ref.current.contains(event.target)
            )
            if (isOutside) onCloseRef.current()
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen, ...refs])
}
