import PropTypes from "prop-types"
import { AnimatePresence } from "motion/react"
import Portal from "../Portal"
import SnackbarItem from "./SnackbarItem"
import * as styles from "./Snackbar.module.css"

const positionClass = {
    top: styles.host_top,
    bottom: styles.host_bottom,
}

const positions = Object.keys(positionClass)

const SnackbarHost = ({ snackbars, onDismiss }) => (
    <Portal>
        <>
            {positions.map((position) => {
                const items = snackbars.filter(
                    (s) => (s.position ?? "bottom") === position
                )
                return (
                    <div
                        key={position}
                        className={`${styles.host} ${positionClass[position]}`}
                    >
                        <AnimatePresence initial={false}>
                            {items.map((item) => (
                                <SnackbarItem
                                    key={item.id}
                                    item={item}
                                    onDismiss={onDismiss}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )
            })}
        </>
    </Portal>
)

SnackbarHost.propTypes = {
    snackbars: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            position: PropTypes.oneOf(positions),
        })
    ).isRequired,
    onDismiss: PropTypes.func.isRequired,
}

export default SnackbarHost
