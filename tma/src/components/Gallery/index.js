import { useRef, useEffect, Children, useEffectEvent } from "react"
import PropTypes from "prop-types"
import * as styles from "./Gallery.module.scss"

const Gallery = ({ children, onPageChange, onScrollProgress }) => {
    const containerRef = useRef(null)

    const handleScrollEvent = useEffectEvent(() => {
        if (containerRef.current) {
            const scrollLeft = containerRef.current.scrollLeft
            const pageWidth = containerRef.current.offsetWidth
            const newPage = Math.round(scrollLeft / pageWidth)

            const progress = (scrollLeft % pageWidth) / pageWidth

            onPageChange?.(newPage)
            onScrollProgress?.(progress)
        }
    })

    useEffect(() => {
        const container = containerRef.current
        if (container) {
            container.addEventListener("scroll", handleScrollEvent)
            return () =>
                container.removeEventListener("scroll", handleScrollEvent)
        }
    }, [])

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
