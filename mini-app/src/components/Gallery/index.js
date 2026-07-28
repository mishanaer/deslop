import { useRef, useEffect, useCallback, Children } from "react"
import PropTypes from "prop-types"
import * as styles from "./Gallery.module.css"

const Gallery = ({ children, onPageChange, onScrollProgress }) => {
    const containerRef = useRef(null)

    const handleScrollEvent = useCallback(() => {
        if (containerRef.current) {
            const scrollLeft = containerRef.current.scrollLeft
            const pageWidth = containerRef.current.offsetWidth
            const newPage = Math.round(scrollLeft / pageWidth)

            const progress = (scrollLeft % pageWidth) / pageWidth

            onPageChange?.(newPage)
            onScrollProgress?.(progress)
        }
    }, [onPageChange, onScrollProgress])

    useEffect(() => {
        const container = containerRef.current
        if (container) {
            container.addEventListener("scroll", handleScrollEvent)
            return () =>
                container.removeEventListener("scroll", handleScrollEvent)
        }
    }, [handleScrollEvent])

    return (
        <div className={styles.root} ref={containerRef}>
            {Children.map(children, (child) => (
                <div className={styles.page}>{child}</div>
            ))}
        </div>
    )
}

Gallery.propTypes = {
    children: PropTypes.node,
    onPageChange: PropTypes.func,
    onScrollProgress: PropTypes.func,
}
export default Gallery
