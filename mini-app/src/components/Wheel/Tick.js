import PropTypes from "prop-types"
import * as m from "motion/react-m"
import { useTransform } from "motion/react"
import * as styles from "./Wheel.module.css"

import { drumTransform } from "../../utils/drum"
import { STEP_WIDTH } from "./useWheelSnap"

const Tick = ({ value, index, x, radius, onSelect }) => {
    const transform = useTransform(x, (latest) =>
        drumTransform(index * STEP_WIDTH + latest, radius, "horizontal")
    )
    const visibility = useTransform(transform, (t) =>
        t ? "visible" : "hidden"
    )

    return (
        <m.div
            className={styles.tick}
            style={{ transform, visibility }}
            onClick={() => onSelect(value)}
        >
            <span className={styles.tickNumber}>{value}</span>
            <span className={styles.tickMark} />
        </m.div>
    )
}

Tick.propTypes = {
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    x: PropTypes.object.isRequired,
    radius: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
}

export default Tick
